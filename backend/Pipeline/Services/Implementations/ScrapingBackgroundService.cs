using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Pipeline.Data;
using Pipeline.DTOs.Leads;
using Pipeline.DTOs.Scraping;
using Pipeline.Enums;
using Pipeline.Hubs;
using Pipeline.Models;
using Pipeline.Services.Interfaces;
using System.Diagnostics;
using System.Text.Json;
using System.Threading.Channels;

namespace Pipeline.Services.Implementations
{
    public class ScrapingBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly Channel<(int sessionId, GenerateLeadsDto request)> _queue;
        private readonly ChannelWriter<(int sessionId, GenerateLeadsDto request)> _writer;

        public ScrapingBackgroundService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;

            var options = new BoundedChannelOptions(100)
            {
                FullMode = BoundedChannelFullMode.Wait,
                SingleReader = true,
                SingleWriter = false
            };
            _queue = Channel.CreateBounded<(int, GenerateLeadsDto)>(options);
            _writer = _queue.Writer;
        }

        public bool EnqueueScrapingJob(int sessionId, GenerateLeadsDto request)
        {
            return _writer.TryWrite((sessionId, request));
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                if (!await _queue.Reader.WaitToReadAsync(stoppingToken))
                    break;

                while (_queue.Reader.TryRead(out var job))
                {
                    var (sessionId, request) = job;
                    try
                    {
                        using var scope = _serviceProvider.CreateScope();
                        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                        var leadService = scope.ServiceProvider.GetRequiredService<ILeadService>();
                        var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<ScrapingHub>>();
                        var mapper = scope.ServiceProvider.GetRequiredService<IMapper>();

                        await ExecutePythonScriptWithScopeAsync(sessionId, request, context, leadService, hubContext, mapper);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error processing scraping job {sessionId}: {ex.Message}");
                    }
                }
            }
        }

        private async Task ExecutePythonScriptWithScopeAsync(
            int sessionId,
            GenerateLeadsDto request,
            ApplicationDbContext context,
            ILeadService leadService,
            IHubContext<ScrapingHub> hubContext,
            IMapper mapper)
        {
            try
            {
                var session = await context.ScrapingSessions.FindAsync(sessionId);
                if (session == null) return;

                session.Status = ScrapingStatus.Running;
                session.StartTime = DateTime.UtcNow;
                await context.SaveChangesAsync();

                using var configScope = _serviceProvider.CreateScope();
                var configuration = configScope.ServiceProvider.GetRequiredService<IConfiguration>();
                var scriptPath = configuration["Python:ScriptPath"];
                var pythonExe = configuration["Python:ExecutablePath"] ?? "python";

                var startInfo = new ProcessStartInfo
                {
                    FileName = pythonExe,
                    Arguments = $"{scriptPath}/lead_scraper.py --niche \"{request.Niche}\" --location \"{request.Location}\" --count {request.TargetCount} --session-id {sessionId}",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                };

                using var process = Process.Start(startInfo);
                if (process != null)
                {
                    process.OutputDataReceived += async (sender, e) =>
                    {
                        if (!string.IsNullOrEmpty(e.Data))
                        {
                            using var eventScope = _serviceProvider.CreateScope();
                            var eventContext = eventScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                            var eventLeadService = eventScope.ServiceProvider.GetRequiredService<ILeadService>();
                            var eventHubContext = eventScope.ServiceProvider.GetRequiredService<IHubContext<ScrapingHub>>();
                            var eventMapper = eventScope.ServiceProvider.GetRequiredService<IMapper>();

                            await ProcessScriptOutputAsync(sessionId, e.Data, eventContext, eventLeadService, eventHubContext, eventMapper);
                        }
                    };

                    process.BeginOutputReadLine();
                    await process.WaitForExitAsync();

                    var finalSession = await context.ScrapingSessions.FindAsync(sessionId);
                    if (finalSession != null)
                    {
                        finalSession.Status = process.ExitCode == 0 ? ScrapingStatus.Completed : ScrapingStatus.Failed;
                        finalSession.EndTime = DateTime.UtcNow;
                        finalSession.ProgressPercentage = 100;
                        await context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                var session = await context.ScrapingSessions.FindAsync(sessionId);
                if (session != null)
                {
                    session.Status = ScrapingStatus.Failed;
                    session.EndTime = DateTime.UtcNow;
                    session.ErrorMessage = ex.Message;
                    await context.SaveChangesAsync();
                }
            }
        }

        private async Task ProcessScriptOutputAsync(
            int sessionId,
            string output,
            ApplicationDbContext context,
            ILeadService leadService,
            IHubContext<ScrapingHub> hubContext,
            IMapper mapper)
        {
            try
            {
                var data = JsonSerializer.Deserialize<JsonElement>(output);
                if (data.TryGetProperty("type", out var typeElement))
                {
                    switch (typeElement.GetString())
                    {
                        case "lead":
                            await ProcessLeadDataAsync(sessionId, data, context, leadService);
                            break;
                        case "completion":
                            await ProcessCompletionAsync(sessionId, data, context, hubContext, mapper);
                            break;
                    }
                }
            }
            catch (JsonException)
            {
                // Not JSON output, ignore
            }
        }

        private async Task ProcessLeadDataAsync(int sessionId, JsonElement data, ApplicationDbContext context, ILeadService leadService)
        {
            try
            {
                var leadData = data.GetProperty("data");
                var createLeadDto = new CreateLeadDto
                {
                    Name = leadData.GetProperty("name").GetString() ?? "",
                    Address = leadData.TryGetProperty("address", out var addr) ? addr.GetString() ?? "" : "",
                    Phone = leadData.TryGetProperty("phone", out var phone) ? phone.GetString() ?? "" : "",
                    Website = leadData.TryGetProperty("website", out var website) ? website.GetString() ?? "" : "",
                    Categories = leadData.TryGetProperty("categories", out var categories) ? categories.GetString() ?? "" : ""
                };

                if (leadData.TryGetProperty("rating", out var ratingProp))
                {
                    if (ratingProp.ValueKind == JsonValueKind.Number)
                        createLeadDto.Rating = (decimal)ratingProp.GetDouble();
                    else if (decimal.TryParse(ratingProp.GetString(), out var rating))
                        createLeadDto.Rating = rating;
                }

                createLeadDto.Source = LeadSource.YellowPages;
                createLeadDto.Tier = LeadTier.Starting;

                var session = await context.ScrapingSessions.FindAsync(sessionId);
                if (session?.CreatedById != null)
                {
                    try
                    {
                        var leadDto = await leadService.CreateLeadAsync(createLeadDto, session.CreatedById);
                        var lead = await context.Leads.FindAsync(leadDto.Id);
                        if (lead != null)
                        {
                            lead.ScrapingSessionId = sessionId;
                            await context.SaveChangesAsync();
                        }
                    }
                    catch (InvalidOperationException ex)
                    {
                        Console.WriteLine($"Duplicate lead skipped: {ex.Message}");
                        session.DuplicatesSkipped++;
                        await context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing lead data for session {sessionId}: {ex.Message}");
            }
        }

        private async Task ProcessCompletionAsync(int sessionId, JsonElement data, ApplicationDbContext context, IHubContext<ScrapingHub> hubContext, IMapper mapper)
        {
            var session = await context.ScrapingSessions.FindAsync(sessionId);
            if (session == null) return;

            session.Status = ScrapingStatus.Completed;
            session.EndTime = DateTime.UtcNow;
            session.ProgressPercentage = 100;

            if (data.TryGetProperty("total_leads", out var totalLeads))
                session.ActualLeadCount = totalLeads.GetInt32();
            if (data.TryGetProperty("duplicates_skipped", out var duplicates))
                session.DuplicatesSkipped = duplicates.GetInt32();

            await context.SaveChangesAsync();

            var sessionDto = mapper.Map<ScrapingSessionDto>(session);
            await hubContext.Clients.All.SendAsync("ScrapingCompleted", sessionDto);
        }
    }
}
