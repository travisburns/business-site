using Pipeline.DTOs.Leads;
using Pipeline.DTOs.Scraping;

namespace Pipeline.Services.Interfaces
{
    public interface IPythonScriptService
    {
        Task<ScrapingSessionDto> StartScrapingSessionAsync(GenerateLeadsDto request, string userId);
        Task<bool> StopScrapingSessionAsync(int sessionId);
        Task<ScrapingSessionDto?> GetScrapingSessionAsync(int sessionId);
        Task<List<ScrapingSessionDto>> GetActiveScrapingSessionsAsync();
        Task<ScrapingProgressDto?> GetScrapingProgressAsync(int sessionId);
        Task<List<ScrapingSessionDto>> GetScrapingSessionsAsync();
        Task<ScrapingSessionDto?> GetScrapingSessionByIdAsync(int id);
        Task<bool> ProcessScrapingResultsAsync(int sessionId, string pythonOutput);
    }
}
