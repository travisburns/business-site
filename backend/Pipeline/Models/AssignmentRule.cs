namespace Pipeline.Models
{
    public class AssignmentRule
    {
        public int Id { get; set; }
        public int Priority { get; set; }
        public int AssignToSalespersonId { get; set; }
        public Salesperson? AssignToSalesperson { get; set; }
        public string? SourceFilter { get; set; }
        public string? TierFilter { get; set; }
        public string? IndustryFilter { get; set; }
        public bool IsActive { get; set; } = true;
        public string? CreatedById { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? LastModifiedDate { get; set; }
    }
}
