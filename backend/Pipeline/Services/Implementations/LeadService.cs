using AutoMapper;
using Pipeline.Configuration;
using Pipeline.Data;
using Pipeline.DTOs.Common;
using Pipeline.DTOs.Leads;
using Pipeline.Enums;
using Pipeline.Models;
using Pipeline.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Pipeline.Extensions;

namespace Pipeline.Services.Implementations
{
    public class LeadService : ILeadService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public LeadService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PagedResultDto<LeadDto>> GetLeadsAsync(LeadFilterDto filter)
        {
            var query = _context.Leads
                .Include(l => l.AssignedToSalesperson)
                .Include(l => l.CreatedBy)
                .Include(l => l.LastModifiedBy)
                .AsQueryable();

            if (filter.Status.HasValue)
                query = query.Where(l => l.Status == filter.Status.Value);
            if (filter.Tier.HasValue)
                query = query.Where(l => l.Tier == filter.Tier.Value);
            if (!string.IsNullOrEmpty(filter.Source))
                query = query.Where(l => l.Source.ToString() == filter.Source);
            if (filter.AssignedToSalespersonId.HasValue)
                query = query.Where(l => l.AssignedToSalespersonId == filter.AssignedToSalespersonId.Value);
            if (filter.CreatedDateFrom.HasValue)
                query = query.Where(l => l.CreatedDate >= filter.CreatedDateFrom.Value);
            if (filter.CreatedDateTo.HasValue)
                query = query.Where(l => l.CreatedDate <= filter.CreatedDateTo.Value);
            if (filter.OnlyUnassigned)
                query = query.Where(l => l.AssignedToSalespersonId == null);
            if (filter.OnlyHighPriority)
                query = query.Where(l => l.Tier == LeadTier.Enterprise || l.Tier == LeadTier.Corporate);
            if (!string.IsNullOrEmpty(filter.SearchTerm))
            {
                query = query.Where(l => l.Name.Contains(filter.SearchTerm) ||
                                       l.ContactPerson.Contains(filter.SearchTerm) ||
                                       l.Email.Contains(filter.SearchTerm) ||
                                       l.Website.Contains(filter.SearchTerm) ||
                                       l.Industry.Contains(filter.SearchTerm));
            }

            query = filter.SortBy?.ToLower() switch
            {
                "name" => filter.SortDescending ? query.OrderByDescending(l => l.Name) : query.OrderBy(l => l.Name),
                "status" => filter.SortDescending ? query.OrderByDescending(l => l.Status) : query.OrderBy(l => l.Status),
                "tier" => filter.SortDescending ? query.OrderByDescending(l => l.Tier) : query.OrderBy(l => l.Tier),
                "source" => filter.SortDescending ? query.OrderByDescending(l => l.Source) : query.OrderBy(l => l.Source),
                "industry" => filter.SortDescending ? query.OrderByDescending(l => l.Industry) : query.OrderBy(l => l.Industry),
                "createddate" => filter.SortDescending ? query.OrderByDescending(l => l.CreatedDate) : query.OrderBy(l => l.CreatedDate),
                "score" => filter.SortDescending ? query.OrderByDescending(l => l.Score) : query.OrderBy(l => l.Score),
                _ => query.OrderByDescending(l => l.CreatedDate)
            };

            return query.ToPagedResult<Lead, LeadDto>(_mapper, filter.PageNumber, filter.PageSize);
        }

        public async Task<CombinedLeadDto?> GetLeadByIdAsync(int id)
        {
            var lead = await _context.Leads
                .Include(l => l.AssignedToSalesperson)
                .Include(l => l.CreatedBy)
                .Include(l => l.LastModifiedBy)
                .FirstOrDefaultAsync(l => l.Id == id);
            return lead != null ? _mapper.Map<CombinedLeadDto>(lead) : null;
        }

        public async Task<CombinedLeadDto> CreateLeadAsync(CreateLeadDto createDto, string userId)
        {
            if (!string.IsNullOrEmpty(createDto.Email))
            {
                var existingLead = await _context.Leads
                    .FirstOrDefaultAsync(l => l.Email == createDto.Email && l.Status != LeadStatus.Lost);
                if (existingLead != null)
                    throw new InvalidOperationException($"Lead with email '{createDto.Email}' already exists.");
            }

            if (!string.IsNullOrEmpty(createDto.Website))
            {
                var existingLead = await _context.Leads
                    .FirstOrDefaultAsync(l => l.Website == createDto.Website && l.Status != LeadStatus.Lost);
                if (existingLead != null)
                    throw new InvalidOperationException($"Lead with website '{createDto.Website}' already exists.");
            }

            var lead = _mapper.Map<Lead>(createDto);
            lead.CreatedById = userId;
            lead.Status = LeadStatus.New;
            lead.Score = 0;

            _context.Leads.Add(lead);
            await _context.SaveChangesAsync();

            return await GetLeadByIdAsync(lead.Id) ?? throw new InvalidOperationException("Failed to retrieve created lead.");
        }

        public async Task<CombinedLeadDto> UpdateLeadAsync(UpdateLeadDto updateDto, string userId)
        {
            var existingLead = await _context.Leads.FindAsync(updateDto.Id);
            if (existingLead == null)
                throw new ArgumentException($"Lead with ID {updateDto.Id} not found.");

            if (!string.IsNullOrEmpty(updateDto.Email))
            {
                var duplicateLead = await _context.Leads
                    .FirstOrDefaultAsync(l => l.Id != updateDto.Id &&
                                            l.Email == updateDto.Email &&
                                            l.Status != LeadStatus.Lost);
                if (duplicateLead != null)
                    throw new InvalidOperationException($"Another lead with email '{updateDto.Email}' already exists.");
            }

            _mapper.Map(updateDto, existingLead);
            existingLead.LastModifiedById = userId;
            await _context.SaveChangesAsync();

            return await GetLeadByIdAsync(existingLead.Id) ?? throw new InvalidOperationException("Failed to retrieve updated lead.");
        }

        public async Task<bool> DeleteLeadAsync(int id)
        {
            var lead = await _context.Leads.FindAsync(id);
            if (lead == null) return false;

            // Soft delete
            lead.Status = LeadStatus.Lost;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> AssignLeadAsync(int leadId, int salespersonId, string userId)
        {
            var lead = await _context.Leads.FindAsync(leadId);
            if (lead == null) return false;

            var salesperson = await _context.Salespeople.FindAsync(salespersonId);
            if (salesperson == null) return false;

            lead.AssignedToSalespersonId = salespersonId;
            lead.LastModifiedById = userId;

            var assignment = new LeadAssignment
            {
                LeadId = leadId,
                SalespersonId = salespersonId,
                AssignedDate = DateTime.UtcNow,
                AssignedById = userId
            };
            _context.LeadAssignments.Add(assignment);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UnassignLeadAsync(int leadId, string userId)
        {
            var lead = await _context.Leads.FindAsync(leadId);
            if (lead == null) return false;

            lead.AssignedToSalespersonId = null;
            lead.LastModifiedById = userId;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateLeadStatusAsync(int leadId, LeadStatus status, string userId)
        {
            var lead = await _context.Leads.FindAsync(leadId);
            if (lead == null) return false;

            lead.Status = status;
            lead.LastModifiedById = userId;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateLeadScoreAsync(int leadId, decimal score)
        {
            var lead = await _context.Leads.FindAsync(leadId);
            if (lead == null) return false;

            lead.Score = score;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<CombinedLeadDto>> GetUnassignedLeadsAsync()
        {
            var leads = await _context.Leads
                .Include(l => l.CreatedBy)
                .Where(l => l.AssignedToSalespersonId == null && l.Status == LeadStatus.New)
                .OrderByDescending(l => l.Score)
                .ToListAsync();
            return _mapper.Map<List<CombinedLeadDto>>(leads);
        }

        public async Task<List<CombinedLeadDto>> GetLeadsBySalespersonAsync(int salespersonId)
        {
            var leads = await _context.Leads
                .Include(l => l.AssignedToSalesperson)
                .Include(l => l.CreatedBy)
                .Where(l => l.AssignedToSalespersonId == salespersonId)
                .OrderByDescending(l => l.CreatedDate)
                .ToListAsync();
            return _mapper.Map<List<CombinedLeadDto>>(leads);
        }

        public async Task<List<LeadDto>> GetHighPriorityLeadsAsync()
        {
            var leads = await _context.Leads
                .Include(l => l.AssignedToSalesperson)
                .Include(l => l.CreatedBy)
                .Where(l => (l.Tier == LeadTier.Enterprise || l.Tier == LeadTier.Corporate) &&
                          l.Status != LeadStatus.Won && l.Status != LeadStatus.Lost)
                .OrderByDescending(l => l.Score)
                .ToListAsync();
            return _mapper.Map<List<LeadDto>>(leads);
        }

        public async Task<bool> BulkAssignLeadsAsync(List<int> leadIds, int salespersonId, string userId)
        {
            var leads = await _context.Leads
                .Where(l => leadIds.Contains(l.Id))
                .ToListAsync();
            if (!leads.Any()) return false;

            var salesperson = await _context.Salespeople.FindAsync(salespersonId);
            if (salesperson == null) return false;

            foreach (var lead in leads)
            {
                lead.AssignedToSalespersonId = salespersonId;
                lead.LastModifiedById = userId;

                var assignment = new LeadAssignment
                {
                    LeadId = lead.Id,
                    SalespersonId = salespersonId,
                    AssignedDate = DateTime.UtcNow,
                    AssignedById = userId
                };
                _context.LeadAssignments.Add(assignment);
            }
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> BulkUpdateStatusAsync(List<int> leadIds, LeadStatus status, string userId)
        {
            var leads = await _context.Leads
                .Where(l => leadIds.Contains(l.Id))
                .ToListAsync();
            if (!leads.Any()) return false;

            foreach (var lead in leads)
            {
                lead.Status = status;
                lead.LastModifiedById = userId;
            }
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<LeadDto>> ImportLeadsAsync(List<CreateLeadDto> createDtos, string userId)
        {
            var createdLeads = new List<Lead>();
            foreach (var createDto in createDtos)
            {
                if (!string.IsNullOrEmpty(createDto.Email))
                {
                    var existingLead = await _context.Leads
                        .FirstOrDefaultAsync(l => l.Email == createDto.Email && l.Status != LeadStatus.Lost);
                    if (existingLead != null) continue;
                }

                var lead = _mapper.Map<Lead>(createDto);
                lead.CreatedById = userId;
                lead.Status = LeadStatus.New;
                lead.Score = 0;
                _context.Leads.Add(lead);
                createdLeads.Add(lead);
            }
            await _context.SaveChangesAsync();
            return _mapper.Map<List<LeadDto>>(createdLeads);
        }

        public async Task<PagedResultDto<CombinedLeadDto>> GetManagedLeadsAsync(LeadFilterDto filter)
        {
            var query = _context.Leads
                .Include(l => l.AssignedToSalesperson)
                .Include(l => l.CreatedBy)
                .Where(l => l.LeadManagementId != null)
                .AsQueryable();

            if (filter.Status.HasValue)
                query = query.Where(l => l.Status == filter.Status.Value);
            if (filter.Tier.HasValue)
                query = query.Where(l => l.Tier == filter.Tier.Value);
            if (!string.IsNullOrEmpty(filter.SearchTerm))
            {
                query = query.Where(l => l.Name.Contains(filter.SearchTerm) ||
                                       l.Email.Contains(filter.SearchTerm));
            }

            return query.ToPagedResult<Lead, CombinedLeadDto>(_mapper, filter.PageNumber, filter.PageSize);
        }

        public async Task<PagedResultDto<CombinedLeadDto>> GetUnmanagedLeadsAsync(string source, int count)
        {
            var query = _context.Leads
                .Where(l => l.LeadManagementId == null)
                .AsQueryable();

            // Apply source filter before limiting
            if (!string.IsNullOrEmpty(source))
                query = query.Where(l => l.Source.ToString() == source);

            var leads = await query
                .OrderByDescending(l => l.ConversionProbability)
                .Take(count)
                .ToListAsync();

            var mappedLeads = _mapper.Map<List<CombinedLeadDto>>(leads);
            return new PagedResultDto<CombinedLeadDto>
            {
                Items = mappedLeads,
                TotalCount = mappedLeads.Count,
                PageNumber = 1,
                PageSize = count,
                TotalPages = 1
            };
        }

        public async Task<CombinedLeadDto> ImportLeadAsync(ImportLeadDto importDto)
        {
            var lead = await _context.Leads.FindAsync(importDto.ScrapedLeadId);
            if (lead == null)
                throw new ArgumentException($"Lead with ID {importDto.ScrapedLeadId} not found.");

            lead.LeadManagementId = importDto.ScrapedLeadId;
            lead.AssignedToSalespersonId = importDto.AssignToSalespersonId;
            lead.EstimatedValue = importDto.EstimatedValue;
            lead.Notes = importDto.Notes;

            await _context.SaveChangesAsync();
            return _mapper.Map<CombinedLeadDto>(lead);
        }

        public async Task<BulkImportResult> BulkImportLeadsAsync(BulkImportDto bulkImportDto)
        {
            var result = new BulkImportResult();
            var leads = await _context.Leads
                .Where(l => bulkImportDto.ScrapedLeadIds.Contains(l.Id))
                .ToListAsync();

            foreach (var lead in leads)
            {
                try
                {
                    lead.LeadManagementId = lead.Id;
                    lead.AssignedToSalespersonId = bulkImportDto.AssignToSalespersonId;
                    lead.EstimatedValue = bulkImportDto.EstimatedValue;
                    lead.Notes = bulkImportDto.Notes;
                    result.ImportedLeadIds.Add(lead.Id);
                    result.SuccessCount++;
                }
                catch (Exception ex)
                {
                    result.Errors.Add($"Error importing lead {lead.Id}: {ex.Message}");
                    result.ErrorCount++;
                }
            }
            await _context.SaveChangesAsync();
            return result;
        }

        public async Task<List<CombinedLeadDto>> GetFollowUpLeadsAsync()
        {
            var leads = await _context.Leads
                .Include(l => l.AssignedToSalesperson)
                .Where(l => l.NextFollowUpDate.HasValue && l.NextFollowUpDate <= DateTime.UtcNow)
                .ToListAsync();
            return _mapper.Map<List<CombinedLeadDto>>(leads);
        }

        public async Task<Dictionary<string, int>> GetLeadStatsByStatusAsync()
        {
            return await _context.Leads
                .GroupBy(l => l.Status)
                .ToDictionaryAsync(g => g.Key.ToString(), g => g.Count());
        }

        public async Task<Dictionary<string, int>> GetLeadStatsBySourceAsync()
        {
            return await _context.Leads
                .GroupBy(l => l.Source)
                .ToDictionaryAsync(g => g.Key.ToString(), g => g.Count());
        }

        public async Task<List<string>> GetAvailableSourcesAsync()
        {
            return await _context.Leads
                .Select(l => l.Source.ToString())
                .Distinct()
                .ToListAsync();
        }

        public async Task<List<SalespersonWorkloadDto>> GetTeamWorkloadAsync()
        {
            var salespeople = await _context.Salespeople
                .Include(s => s.AssignedLeads.Where(l => l.Status != LeadStatus.Won && l.Status != LeadStatus.Lost))
                .ToListAsync();

            var workloadData = new List<SalespersonWorkloadDto>();
            foreach (var salesperson in salespeople)
            {
                var activeLeads = salesperson.AssignedLeads.ToList();
                workloadData.Add(new SalespersonWorkloadDto
                {
                    SalespersonId = salesperson.Id,
                    FullName = salesperson.FullName,
                    ActiveLeadCount = activeLeads.Count,
                    CapacityLimit = 10,
                    NewLeads = activeLeads.Count(l => l.Status == LeadStatus.New),
                    ContactedLeads = activeLeads.Count(l => l.Status == LeadStatus.Contacted),
                    QualifiedLeads = activeLeads.Count(l => l.Status == LeadStatus.Qualified),
                    TotalRevenue = salesperson.TotalRevenue,
                    ConversionRate = salesperson.ConversionRate
                });
            }
            return workloadData.OrderBy(w => w.FullName).ToList();
        }

        public async Task<List<AssignmentRuleDto>> GetAssignmentRulesAsync()
        {
            var rules = await _context.AssignmentRules
                .Include(r => r.AssignToSalesperson)
                .OrderBy(r => r.Priority)
                .ToListAsync();
            return _mapper.Map<List<AssignmentRuleDto>>(rules);
        }

        public async Task<AssignmentRuleDto> CreateAssignmentRuleAsync(CreateAssignmentRuleDto createDto, string userId)
        {
            var salesperson = await _context.Salespeople.FindAsync(createDto.AssignToSalespersonId);
            if (salesperson == null)
                throw new ArgumentException($"Salesperson with ID {createDto.AssignToSalespersonId} not found.");

            var rule = _mapper.Map<AssignmentRule>(createDto);
            rule.CreatedById = userId;
            rule.CreatedDate = DateTime.UtcNow;

            _context.AssignmentRules.Add(rule);
            await _context.SaveChangesAsync();
            return _mapper.Map<AssignmentRuleDto>(rule);
        }

        public async Task<bool> UpdateAssignmentRuleAsync(int id, UpdateAssignmentRuleDto updateDto)
        {
            var rule = await _context.AssignmentRules.FindAsync(id);
            if (rule == null) return false;

            _mapper.Map(updateDto, rule);
            rule.LastModifiedDate = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAssignmentRuleAsync(int id)
        {
            var rule = await _context.AssignmentRules.FindAsync(id);
            if (rule == null) return false;

            _context.AssignmentRules.Remove(rule);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
