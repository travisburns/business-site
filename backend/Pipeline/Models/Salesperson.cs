namespace Pipeline.Models
{
    public class Salesperson
    {
        public int Id { get; set; }
        public string UserId { get; set; } = "";
        public ApplicationUser? User { get; set; }
        public string FullName { get; set; } = "";
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public bool IsActive { get; set; } = true;
        public decimal TotalRevenue { get; set; }
        public decimal ConversionRate { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public ICollection<Lead> AssignedLeads { get; set; } = new List<Lead>();
        public ICollection<LeadAssignment> Assignments { get; set; } = new List<LeadAssignment>();
    }
}
