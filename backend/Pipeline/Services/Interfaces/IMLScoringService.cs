using Pipeline.DTOs.Scraping;

namespace Pipeline.Services.Interfaces
{
    public interface IMLScoringService
    {
        Task<MLPredictionDto> ScoreLeadAsync(int leadId);
        Task<List<MLPredictionDto>> BulkScoreLeadsAsync(BulkMLPredictionDto bulkRequest);
        Task<bool> TrainModelAsync();
        Task<decimal> GetModelAccuracyAsync();
        Task<List<string>> GetModelFeaturesAsync();
        Task<bool> UpdateLeadScoresAsync();
    }
}
