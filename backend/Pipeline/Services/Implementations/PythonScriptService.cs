using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Pipeline.Data;
using Pipeline.DTOs.Leads;
using Pipeline.DTOs.Scraping;
using Pipeline.Enums;
using Pipeline.Hubs;
using Pipeline.Models;
using Pipeline.Services.Interfaces;
using System.Diagnostics;
using System.Text.Json;

namespace Pipeline.Services.Implementations
{
    public class PythonScriptService : IPythonScriptService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILeadService _leadService;
        private readonly IHubContext<ScrapingHub> _hubContext;
        private readonly IConfiguration _configuration;
        private readonly IServiceProvider _serviceProvider;
        private readonly ScrapingBackgroundService _backgroundService;

        public PythonScriptService(
            ApplicationDbContext context,
            IMapper mapper,
            ILeadService leadService,
            IHubContext<ScrapingHub> hubContext,
            IConfiguration configuration,
            IServiceProvider serviceProvider,
            ScrapingBackgroundService backgroundService)
        {
            _context = context;
            _mapper = mapper;
            _leadService = leadService;
            _hubContext = hubContext;
            _configuration = configuration;
            _serviceProvider = serviceProvider;
            _backgroundService = backgroundService;
        }

        public async Task<ScrapingSessionDto> StartScrapingSessionAsync(GenerateLeadsDto request, string userId)
        {
            var session = new ScrapingSession
            {
                SessionName = request.SessionName ?? $"Scraping {request.Niche} in {request.Location}",
                Niche = request.Niche,
                Location = request.Location,
                TargetCount = request.TargetCount,
                Status = ScrapingStatus.Pending,
                CreatedById = userId,
                CreatedDate = DateTime.UtcNow
            };

            _context.ScrapingSessions.Add(session);
            await _context.SaveChangesAsync();

            _backgroundService.EnqueueScrapingJob(session.Id, request);

            return _mapper.Map<ScrapingSessionDto>(session);
        }

        public async Task<bool> StopScrapingSessionAsync(int sessionId)
        {
            var session = await _context.ScrapingSessions.FindAsync(sessionId);
            if (session == null) return false;

            session.Status = ScrapingStatus.Cancelled;
            session.EndTime = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<ScrapingSessionDto?> GetScrapingSessionAsync(int sessionId)
        {
            var session = await _context.ScrapingSessions
                .Include(s => s.CreatedBy)
                .FirstOrDefaultAsync(s => s.Id == sessionId);
            return session != null ? _mapper.Map<ScrapingSessionDto>(session) : null;
        }

        public async Task<List<ScrapingSessionDto>> GetActiveScrapingSessionsAsync()
        {
            var sessions = await _context.ScrapingSessions
                .Include(s => s.CreatedBy)
                .Where(s => s.Status == ScrapingStatus.Running || s.Status == ScrapingStatus.Pending)
                .OrderByDescending(s => s.CreatedDate)
                .ToListAsync();
            return _mapper.Map<List<ScrapingSessionDto>>(sessions);
        }

        public async Task<ScrapingProgressDto?> GetScrapingProgressAsync(int sessionId)
        {
            var session = await _context.ScrapingSessions.FindAsync(sessionId);
            return session != null ? _mapper.Map<ScrapingProgressDto>(session) : null;
        }

        public async Task<List<ScrapingSessionDto>> GetScrapingSessionsAsync()
        {
            var sessions = await _context.ScrapingSessions
                .Include(s => s.CreatedBy)
                .OrderByDescending(s => s.CreatedDate)
                .ToListAsync();
            return _mapper.Map<List<ScrapingSessionDto>>(sessions);
        }

        public async Task<ScrapingSessionDto?> GetScrapingSessionByIdAsync(int id)
        {
            var session = await _context.ScrapingSessions
                .Include(s => s.CreatedBy)
                .FirstOrDefaultAsync(s => s.Id == id);
            return session != null ? _mapper.Map<ScrapingSessionDto>(session) : null;
        }

        public async Task<bool> ProcessScrapingResultsAsync(int sessionId, string pythonOutput)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var leadService = scope.ServiceProvider.GetRequiredService<ILeadService>();
                var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<ScrapingHub>>();
                var mapper = scope.ServiceProvider.GetRequiredService<IMapper>();

                await ProcessScriptOutputDirectAsync(sessionId, pythonOutput, context, leadService, hubContext, mapper);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        private async Task UpdateProgressWithScopeAsync(int sessionId, JsonElement data, ApplicationDbContext context, IHubContext<ScrapingHub> hubContext, IMapper mapper)
        {
            var session = await context.ScrapingSessions.FindAsync(sessionId);
            if (session == null) return;

            if (data.TryGetProperty("current_page", out var currentPage))
                session.CurrentPage = currentPage.GetInt32();
            if (data.TryGetProperty("total_pages", out var totalPages))
                session.TotalPages = totalPages.GetInt32();
            if (data.TryGetProperty("leads_found", out var leadsFound))
                session.ActualLeadCount = leadsFound.GetInt32();
            if (data.TryGetProperty("duplicates_skipped", out var duplicates))
                session.DuplicatesSkipped = duplicates.GetInt32();

            if (session.TotalPages > 0)
                session.ProgressPercentage = (decimal)session.CurrentPage / session.TotalPages * 100;

            await context.SaveChangesAsync();

            var progress = mapper.Map<ScrapingProgressDto>(session);
            await hubContext.Clients.All.SendAsync("ScrapingProgress", progress);
        }

        private async Task ProcessLeadDataWithScopeAsync(int sessionId, JsonElement data, ApplicationDbContext context, ILeadService leadService)
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

                if (leadData.TryGetProperty("founded_year", out var foundedYearProp))
                {
                    if (int.TryParse(foundedYearProp.GetString(), out var foundedYear))
                        createLeadDto.FoundedYear = foundedYear;
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
                    catch (InvalidOperationException)
                    {
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

        private async Task ProcessCompletionWithScopeAsync(int sessionId, JsonElement data, ApplicationDbContext context, IHubContext<ScrapingHub> hubContext, IMapper mapper)
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

        private async Task HandleScriptErrorAsync(int sessionId, string errorMessage)
        {
            var session = await _context.ScrapingSessions.FindAsync(sessionId);
            if (session == null) return;

            session.Status = ScrapingStatus.Failed;
            session.EndTime = DateTime.UtcNow;
            session.ErrorMessage = errorMessage;
            await _context.SaveChangesAsync();

            var sessionDto = _mapper.Map<ScrapingSessionDto>(session);
            await _hubContext.Clients.All.SendAsync("ScrapingError", sessionDto);
        }

        private async Task ProcessScriptOutputDirectAsync(int sessionId, string output, ApplicationDbContext context, ILeadService leadService, IHubContext<ScrapingHub> hubContext, IMapper mapper)
        {
            try
            {
                var data = JsonSerializer.Deserialize<JsonElement>(output);
                if (data.TryGetProperty("type", out var typeElement))
                {
                    switch (typeElement.GetString())
                    {
                        case "progress":
                            await UpdateProgressWithScopeAsync(sessionId, data, context, hubContext, mapper);
                            break;
                        case "lead":
                            await ProcessLeadDataWithScopeAsync(sessionId, data, context, leadService);
                            break;
                        case "completion":
                            await ProcessCompletionWithScopeAsync(sessionId, data, context, hubContext, mapper);
                            break;
                    }
                }
            }
            catch (JsonException)
            {
                // Not JSON output, ignore
            }
        }
    }
}
