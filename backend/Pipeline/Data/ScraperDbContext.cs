using Pipeline.Models.Scraper;
using Microsoft.EntityFrameworkCore;

namespace Pipeline.Data
{
    public class ScraperDbContext : DbContext
    {
        public ScraperDbContext(DbContextOptions<ScraperDbContext> options) : base(options)
        {
        }

        public DbSet<RestaurantLead> Restaurants { get; set; }
        public DbSet<AutoShopLead> AutoShops { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<RestaurantLead>(entity =>
            {
                entity.ToTable("restaurants");
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Rating).HasPrecision(3, 2);
            });

            modelBuilder.Entity<AutoShopLead>(entity =>
            {
                entity.ToTable("auto_shops");
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Rating).HasPrecision(3, 2);
            });
        }
    }
}
