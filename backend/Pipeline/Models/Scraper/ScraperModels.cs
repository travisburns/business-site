namespace Pipeline.Models.Scraper
{
    public class RestaurantLead
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Website { get; set; }
        public decimal? Rating { get; set; }
        public string? Categories { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public DateTime ScrapedDate { get; set; } = DateTime.UtcNow;
    }

    public class AutoShopLead
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Website { get; set; }
        public decimal? Rating { get; set; }
        public string? Categories { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public DateTime ScrapedDate { get; set; } = DateTime.UtcNow;
    }
}
