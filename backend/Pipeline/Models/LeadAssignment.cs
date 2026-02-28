namespace Pipeline.Models
{
    public class LeadAssignment
    {
        public int Id { get; set; }
        public int LeadId { get; set; }
        public Lead? Lead { get; set; }
        public int SalespersonId { get; set; }
        public Salesperson? Salesperson { get; set; }
        public DateTime AssignedDate { get; set; }
        public string? AssignedById { get; set; }
        public ApplicationUser? AssignedBy { get; set; }
    }
}
