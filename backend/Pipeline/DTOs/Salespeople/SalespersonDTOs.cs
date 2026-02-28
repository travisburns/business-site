namespace Pipeline.DTOs.Salespeople
{
    public class SalespersonWorkloadDto
    {
        public int SalespersonId { get; set; }
        public string FullName { get; set; } = "";
        public int ActiveLeadCount { get; set; }
        public int CapacityLimit { get; set; }
        public int NewLeads { get; set; }
        public int ContactedLeads { get; set; }
        public int QualifiedLeads { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal ConversionRate { get; set; }
        public bool IsAtCapacity => ActiveLeadCount >= CapacityLimit;
    }

    public class AssignmentRuleDto
    {
        public int Id { get; set; }
        public int Priority { get; set; }
        public int AssignToSalespersonId { get; set; }
        public string? AssignToSalespersonName { get; set; }
        public string? SourceFilter { get; set; }
        public string? TierFilter { get; set; }
        public string? IndustryFilter { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateAssignmentRuleDto
    {
        public int Priority { get; set; }
        public int AssignToSalespersonId { get; set; }
        public string? SourceFilter { get; set; }
        public string? TierFilter { get; set; }
        public string? IndustryFilter { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateAssignmentRuleDto
    {
        public int Priority { get; set; }
        public int AssignToSalespersonId { get; set; }
        public string? SourceFilter { get; set; }
        public string? TierFilter { get; set; }
        public string? IndustryFilter { get; set; }
        public bool IsActive { get; set; }
    }
}
