using Pipeline.Enums;
using System.ComponentModel.DataAnnotations;

namespace Pipeline.DTOs.Leads
{
    public class LeadFilterDto
    {
        public LeadStatus? Status { get; set; }
        public LeadTier? Tier { get; set; }
        public string? Source { get; set; }
        public int? AssignedToSalespersonId { get; set; }
        public DateTime? CreatedDateFrom { get; set; }
        public DateTime? CreatedDateTo { get; set; }
        public bool OnlyUnassigned { get; set; }
        public bool OnlyHighPriority { get; set; }
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; }
        public bool SortDescending { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 25;
    }

    public class LeadDto
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
        public LeadStatus Status { get; set; }
        public LeadTier Tier { get; set; }
        public LeadSource Source { get; set; }
        public decimal Score { get; set; }
        public decimal? ConversionProbability { get; set; }
        public decimal? EstimatedValue { get; set; }
        public string? Notes { get; set; }
        public int? AssignedToSalespersonId { get; set; }
        public string? AssignedSalespersonName { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? LeadManagementId { get; set; }
    }

    public class CombinedLeadDto
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
        public LeadStatus Status { get; set; }
        public LeadTier Tier { get; set; }
        public LeadSource Source { get; set; }
        public decimal Score { get; set; }
        public decimal? ConversionProbability { get; set; }
        public decimal? EstimatedValue { get; set; }
        public string? Notes { get; set; }
        public int? AssignedToSalespersonId { get; set; }
        public string? AssignedSalespersonName { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? LeadManagementId { get; set; }
        public bool IsManaged => LeadManagementId.HasValue;
        public DateTime? NextFollowUpDate { get; set; }
    }

    public class CreateLeadDto
    {
        [Required]
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
        public LeadSource Source { get; set; } = LeadSource.YellowPages;
        public LeadTier Tier { get; set; } = LeadTier.Starting;
        public decimal? EstimatedValue { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdateLeadDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? ContactPerson { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Website { get; set; }
        public string? Address { get; set; }
        public string? Categories { get; set; }
        public string? Industry { get; set; }
        public decimal? Rating { get; set; }
        public LeadStatus? Status { get; set; }
        public LeadTier? Tier { get; set; }
        public decimal? EstimatedValue { get; set; }
        public string? Notes { get; set; }
        public DateTime? NextFollowUpDate { get; set; }
    }

    public class ImportLeadDto
    {
        [Required]
        public int ScrapedLeadId { get; set; }
        public int? AssignToSalespersonId { get; set; }
        public decimal? EstimatedValue { get; set; }
        public string? Notes { get; set; }
    }

    public class BulkImportDto
    {
        [Required]
        public List<int> ScrapedLeadIds { get; set; } = new();
        public int? AssignToSalespersonId { get; set; }
        public decimal? EstimatedValue { get; set; }
        public string? Notes { get; set; }
    }

    public class BulkImportResult
    {
        public int SuccessCount { get; set; }
        public int SkippedCount { get; set; }
        public int ErrorCount { get; set; }
        public List<int> ImportedLeadIds { get; set; } = new();
        public List<string> Errors { get; set; } = new();
    }
}
