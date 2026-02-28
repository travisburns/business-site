using Pipeline.Enums;

namespace Pipeline.Models
{
    public class ScrapingSession
    {
        public int Id { get; set; }
        public string SessionName { get; set; } = "";
        public string Niche { get; set; } = "";
        public string Location { get; set; } = "";
        public int TargetCount { get; set; }
        public ScrapingStatus Status { get; set; } = ScrapingStatus.Pending;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int ActualLeadCount { get; set; }
        public int DuplicatesSkipped { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public decimal ProgressPercentage { get; set; }
        public string? ErrorMessage { get; set; }
        public string? CreatedById { get; set; }
        public ApplicationUser? CreatedBy { get; set; }
        public ICollection<Lead> ScrapedLeads { get; set; } = new List<Lead>();
    }
}
