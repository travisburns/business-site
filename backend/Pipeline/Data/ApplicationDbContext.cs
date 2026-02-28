using digitalheavyweightsAPI.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace digitalheavyweightsAPI.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<ContactSubmission> ContactSubmissions => Set<ContactSubmission>();
    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<AuditRequest> AuditRequests => Set<AuditRequest>();
    public DbSet<AnalyticsEvent> AnalyticsEvents => Set<AnalyticsEvent>();
    public DbSet<Prospect> Prospects => Set<Prospect>();
    public DbSet<OutreachActivity> OutreachActivities => Set<OutreachActivity>();
    public DbSet<FollowUpStep> FollowUpSteps => Set<FollowUpStep>();
    public DbSet<ClientOnboarding> ClientOnboardings => Set<ClientOnboarding>();
    public DbSet<DeliveryProject> DeliveryProjects { get; set; }
    public DbSet<DeliveryTask> DeliveryTasks { get; set; }
    public DbSet<RoiReport> RoiReports { get; set; }

    // ── Scraper / Lead Pipeline ──────────────────────────────
    public DbSet<ScrapingSession> ScrapingSessions => Set<ScrapingSession>();
    public DbSet<Salesperson> Salespeople => Set<Salesperson>();
    public DbSet<LeadAssignment> LeadAssignments => Set<LeadAssignment>();
    public DbSet<AssignmentRule> AssignmentRules => Set<AssignmentRule>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ContactSubmission>(entity =>
        {
            entity.HasIndex(e => e.Email);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasOne(e => e.Lead)
                  .WithOne(l => l.ContactSubmission)
                  .HasForeignKey<Lead>(l => l.ContactSubmissionId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<Lead>(entity =>
        {
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.Email);
            entity.Property(e => e.EstimatedValue).HasColumnType("decimal(18,2)");
            // ── Scraper additions ────────────────────────────
            entity.HasIndex(e => e.ScrapingSessionId);
            entity.HasIndex(e => e.AssignedToSalespersonId);
            entity.HasIndex(e => e.LeadManagementId);
            entity.Property(e => e.Score).HasColumnType("decimal(18,4)");
            entity.Property(e => e.ConversionProbability).HasColumnType("decimal(5,4)");
            entity.HasOne(e => e.ScrapingSession)
                  .WithMany(s => s.ScrapedLeads)
                  .HasForeignKey(e => e.ScrapingSessionId)
                  .OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(e => e.AssignedToSalesperson)
                  .WithMany(s => s.AssignedLeads)
                  .HasForeignKey(e => e.AssignedToSalespersonId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<AuditRequest>(entity =>
        {
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedAt);
        });

        builder.Entity<AnalyticsEvent>(entity =>
        {
            entity.HasIndex(e => e.EventType);
            entity.HasIndex(e => e.CreatedAt);
        });

        builder.Entity<Prospect>(entity =>
        {
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.CompanyName);
            entity.HasIndex(e => e.NextFollowUpAt);
            entity.HasMany(e => e.OutreachActivities)
                  .WithOne(o => o.Prospect)
                  .HasForeignKey(o => o.ProspectId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<OutreachActivity>(entity =>
        {
            entity.HasIndex(e => e.SentAt);
            entity.HasIndex(e => e.Channel);
        });

        builder.Entity<FollowUpStep>(entity =>
        {
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.ScheduledDate);
            entity.HasIndex(e => e.ProspectId);
            entity.HasOne(e => e.Prospect)
                  .WithMany()
                  .HasForeignKey(e => e.ProspectId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<ClientOnboarding>(entity =>
        {
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.ContactEmail);
        });

        // ── Delivery Pipeline ────────────────────────────────
        builder.Entity<DeliveryProject>(e =>
        {
            e.HasIndex(p => p.Status);
            e.HasIndex(p => p.CreatedAt);
            e.HasIndex(p => p.UpdatedAt);
        });

        builder.Entity<DeliveryTask>(e =>
        {
            e.HasOne(t => t.DeliveryProject)
                .WithMany(p => p.Tasks)
                .HasForeignKey(t => t.DeliveryProjectId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(t => t.DeliveryProjectId);
            e.HasIndex(t => new { t.DeliveryProjectId, t.Stage });
        });

        // ── ROI Reports ──────────────────────────────────────
        builder.Entity<RoiReport>(e =>
        {
            e.HasIndex(r => r.Status);
            e.HasIndex(r => r.ReportDate);
            e.HasIndex(r => r.UpdatedAt);
            e.HasIndex(r => r.DeliveryProjectId);
            e.Property(r => r.ServiceCost).HasColumnType("decimal(18,2)");
            e.Property(r => r.AvgJobSize).HasColumnType("decimal(18,2)");
            e.Property(r => r.EstimatedPipelineValue).HasColumnType("decimal(18,2)");
        });

        // ── Scraping Sessions ────────────────────────────────
        builder.Entity<ScrapingSession>(entity =>
        {
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedDate);
            entity.Property(e => e.ProgressPercentage).HasColumnType("decimal(5,2)");
        });

        // ── Salespeople ──────────────────────────────────────
        builder.Entity<Salesperson>(entity =>
        {
            entity.HasIndex(e => e.UserId).IsUnique();
            entity.HasIndex(e => e.IsActive);
            entity.Property(e => e.TotalRevenue).HasColumnType("decimal(18,2)");
            entity.Property(e => e.ConversionRate).HasColumnType("decimal(5,4)");
        });

        // ── Lead Assignments ─────────────────────────────────
        builder.Entity<LeadAssignment>(entity =>
        {
            entity.HasIndex(e => e.LeadId);
            entity.HasIndex(e => e.SalespersonId);
            entity.HasIndex(e => e.AssignedDate);
            entity.HasOne(e => e.Lead)
                  .WithMany(l => l.Assignments)
                  .HasForeignKey(e => e.LeadId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Salesperson)
                  .WithMany(s => s.Assignments)
                  .HasForeignKey(e => e.SalespersonId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Assignment Rules ─────────────────────────────────
        builder.Entity<AssignmentRule>(entity =>
        {
            entity.HasIndex(e => e.Priority);
            entity.HasIndex(e => e.IsActive);
            entity.HasOne(e => e.AssignToSalesperson)
                  .WithMany()
                  .HasForeignKey(e => e.AssignToSalespersonId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
