using Pipeline.DTOs.Common;
using Pipeline.DTOs.Leads;
using Pipeline.DTOs.Salespeople;
using Pipeline.Enums;

namespace Pipeline.Services.Interfaces
{
    public interface ILeadService
    {
        Task<PagedResultDto<LeadDto>> GetLeadsAsync(LeadFilterDto filter);
        Task<CombinedLeadDto?> GetLeadByIdAsync(int id);
        Task<CombinedLeadDto> CreateLeadAsync(CreateLeadDto createDto, string userId);
        Task<CombinedLeadDto> UpdateLeadAsync(UpdateLeadDto updateDto, string userId);
        Task<bool> DeleteLeadAsync(int id);
        Task<bool> AssignLeadAsync(int leadId, int salespersonId, string userId);
        Task<bool> UnassignLeadAsync(int leadId, string userId);
        Task<bool> UpdateLeadStatusAsync(int leadId, LeadStatus status, string userId);
        Task<bool> UpdateLeadScoreAsync(int leadId, decimal score);
        Task<List<CombinedLeadDto>> GetUnassignedLeadsAsync();
        Task<List<CombinedLeadDto>> GetLeadsBySalespersonAsync(int salespersonId);
        Task<List<LeadDto>> GetHighPriorityLeadsAsync();
        Task<bool> BulkAssignLeadsAsync(List<int> leadIds, int salespersonId, string userId);
        Task<bool> BulkUpdateStatusAsync(List<int> leadIds, LeadStatus status, string userId);
        Task<List<LeadDto>> ImportLeadsAsync(List<CreateLeadDto> createDtos, string userId);
        Task<PagedResultDto<CombinedLeadDto>> GetManagedLeadsAsync(LeadFilterDto filter);
        Task<PagedResultDto<CombinedLeadDto>> GetUnmanagedLeadsAsync(string source, int count);
        Task<CombinedLeadDto> ImportLeadAsync(ImportLeadDto importDto);
        Task<BulkImportResult> BulkImportLeadsAsync(BulkImportDto bulkImportDto);
        Task<List<CombinedLeadDto>> GetFollowUpLeadsAsync();
        Task<Dictionary<string, int>> GetLeadStatsByStatusAsync();
        Task<Dictionary<string, int>> GetLeadStatsBySourceAsync();
        Task<List<string>> GetAvailableSourcesAsync();
        Task<List<SalespersonWorkloadDto>> GetTeamWorkloadAsync();
        Task<List<AssignmentRuleDto>> GetAssignmentRulesAsync();
        Task<AssignmentRuleDto> CreateAssignmentRuleAsync(CreateAssignmentRuleDto createDto, string userId);
        Task<bool> UpdateAssignmentRuleAsync(int id, UpdateAssignmentRuleDto updateDto);
        Task<bool> DeleteAssignmentRuleAsync(int id);
    }
}
