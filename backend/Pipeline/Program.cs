using digitalheavyweightsAPI.Data;
using digitalheavyweightsAPI.Extensions;
using digitalheavyweightsAPI.Middleware;
using digitalheavyweightsAPI.Services;
using digitalheavyweightsAPI.Models;
using Pipeline.Data;
using Pipeline.Hubs;
using Pipeline.Services.Implementations;
using Pipeline.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddSingleton<IOutreachTemplateService, OutreachTemplateService>();
builder.Services.AddEndpointsApiExplorer();

// ── SignalR (scraping progress hub) ─────────────────────
builder.Services.AddSignalR();

// ── Scraper DB (separate SQLite DB written to by Python) ─
builder.Services.AddDbContext<ScraperDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("ScraperConnection")));

// ── Scraper / Lead Pipeline services ─────────────────────
builder.Services.AddSingleton<ScrapingBackgroundService>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<ScrapingBackgroundService>());
builder.Services.AddScoped<ILeadService, LeadService>();
builder.Services.AddScoped<IPythonScriptService, PythonScriptService>();
builder.Services.AddScoped<IMLScoringService, MLScoringService>();
builder.Services.AddScoped<IDataExportService, DataExportService>();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new() { Title = "digitalheavyweights API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new()
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter your JWT token"
    });
    options.AddSecurityRequirement(new()
    {
        {
            new()
            {
                Reference = new() { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// CORS — allow frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? new[] { "http://localhost:3000" };
        policy.WithOrigins(origins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Middleware pipeline
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ScrapingHub>("/hubs/scraping");

// Ensure database is created and seed admin role
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        await context.Database.MigrateAsync();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error during database migration/seeding");
    }
}

app.Run();
