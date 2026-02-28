using Pipeline.Enums;

namespace Pipeline.Models
{
    public class Lead
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? ContactPerson { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Website { get; set; }
        public string? Address { get; set; }
        public string? Categories { get; set; }
        public string? Industry { get; set; }
        public decimal? Rating { get; set; }
        public int? FoundedYear { get; set; }
        public LeadStatus Status { get; set; } = LeadStatus.New;
        public LeadTier Tier { get; set; } = LeadTier.Starting;
        public LeadSource Source { get; set; } = LeadSource.YellowPages;
        public decimal Score { get; set; }
        public decimal? ConversionProbability { get; set; }
        public decimal? EstimatedValue { get; set; }
        public string? Notes { get; set; }
        public DateTime? NextFollowUpDate { get; set; }

        // Managed CRM flag — null means unmanaged/scraped only
        public int? LeadManagementId { get; set; }
        public int? ScrapingSessionId { get; set; }
        public ScrapingSession? ScrapingSession { get; set; }

        public int? AssignedToSalespersonId { get; set; }
        public Salesperson? AssignedToSalesperson { get; set; }

        public string? CreatedById { get; set; }
        public ApplicationUser? CreatedBy { get; set; }
        public string? LastModifiedById { get; set; }
        public ApplicationUser? LastModifiedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? LastModifiedDate { get; set; }

        public ICollection<LeadAssignment> Assignments { get; set; } = new List<LeadAssignment>();
    }
}
