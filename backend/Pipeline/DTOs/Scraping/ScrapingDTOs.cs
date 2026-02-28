using Pipeline.Enums;

namespace Pipeline.DTOs.Scraping
{
    public class GenerateLeadsDto
    {
        public string? SessionName { get; set; }
        public string Niche { get; set; } = "";
        public string Location { get; set; } = "";
        public int TargetCount { get; set; } = 50;
        public int? DelayMin { get; set; }
        public int? DelayMax { get; set; }
    }

    public class ScrapingSessionDto
    {
        public int Id { get; set; }
        public string SessionName { get; set; } = "";
        public string Niche { get; set; } = "";
        public string Location { get; set; } = "";
        public int TargetCount { get; set; }
        public ScrapingStatus Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int ActualLeadCount { get; set; }
        public int DuplicatesSkipped { get; set; }
        public decimal ProgressPercentage { get; set; }
        public string? ErrorMessage { get; set; }
        public string? CreatedByName { get; set; }
    }

    public class ScrapingProgressDto
    {
        public int SessionId { get; set; }
        public ScrapingStatus Status { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public decimal ProgressPercentage { get; set; }
        public int LeadsFound { get; set; }
        public int DuplicatesSkipped { get; set; }
        public string? CurrentAction { get; set; }
        public bool IsComplete => Status == ScrapingStatus.Completed || Status == ScrapingStatus.Failed || Status == ScrapingStatus.Cancelled;
        public string? ErrorMessage { get; set; }
    }

    public class MLPredictionDto
    {
        public int LeadId { get; set; }
        public decimal ConversionProbability { get; set; }
        public string PredictedTier { get; set; } = "";
        public decimal EstimatedValue { get; set; }
        public string Confidence { get; set; } = "";
        public List<string> ReasoningFactors { get; set; } = new();
        public DateTime PredictionDate { get; set; }
    }

    public class BulkMLPredictionDto
    {
        public List<int> LeadIds { get; set; } = new();
    }
}
