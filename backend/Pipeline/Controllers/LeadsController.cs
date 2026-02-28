using Microsoft.AspNetCore.Mvc;
using Pipeline.DTOs.Clients;
using Pipeline.DTOs.Common;
using Pipeline.DTOs.Leads;
using Pipeline.DTOs.Salespeople;
using Pipeline.Services.Interfaces;
using System.Security.Claims;

namespace Pipeline.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeadsController : ControllerBase
    {
        private readonly ILeadService _leadService;

        public LeadsController(ILeadService leadService)
        {
            _leadService = leadService;
        }

        /// <summary>
        /// Get fresh leads from scraper database (not yet imported to CRM)
        /// </summary>
        [HttpGet("scraped/{source}")]
        public async Task<ActionResult<ApiResponseDto<PagedResultDto<CombinedLeadDto>>>> GetScrapedLeads(
            string source,
            [FromQuery] int limit = 100)
        {
            try
            {
                var leads = await _leadService.GetUnmanagedLeadsAsync(source, limit);
                return Ok(ApiResponseDto<PagedResultDto<CombinedLeadDto>>.SuccessResult(leads, $"Retrieved {leads.Items.Count} scraped leads"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<PagedResultDto<CombinedLeadDto>>.ErrorResult("Failed to retrieve scraped leads", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Get leads that are being managed in CRM
        /// </summary>
        [HttpGet("managed")]
        public async Task<ActionResult<ApiResponseDto<PagedResultDto<CombinedLeadDto>>>> GetManagedLeads([FromQuery] LeadFilterDto filter)
        {
            try
            {
                var leads = await _leadService.GetManagedLeadsAsync(filter);
                return Ok(ApiResponseDto<PagedResultDto<CombinedLeadDto>>.SuccessResult(leads, "Managed leads retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<PagedResultDto<CombinedLeadDto>>.ErrorResult("Failed to retrieve managed leads", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Get specific lead by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<CombinedLeadDto>>> GetLead(int id)
        {
            try
            {
                var lead = await _leadService.GetLeadByIdAsync(id);
                if (lead == null)
                    return NotFound(ApiResponseDto<CombinedLeadDto>.ErrorResult("Lead not found"));
                return Ok(ApiResponseDto<CombinedLeadDto>.SuccessResult(lead, "Lead retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<CombinedLeadDto>.ErrorResult("Failed to retrieve lead", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Import a scraped lead into CRM management
        /// </summary>
        [HttpPost("import")]
        public async Task<ActionResult<ApiResponseDto<object>>> ImportLead([FromBody] ImportLeadDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ApiResponseDto<object>.ErrorResult("Invalid data", ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));

                var lead = await _leadService.ImportLeadAsync(dto);
                return Ok(ApiResponseDto<object>.SuccessResult(new { leadId = lead.Id }, "Lead imported successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ApiResponseDto<object>.ErrorResult(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<object>.ErrorResult("Failed to import lead", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Bulk import multiple scraped leads
        /// </summary>
        [HttpPost("import/bulk")]
        public async Task<ActionResult<ApiResponseDto<BulkImportResult>>> BulkImportLeads([FromBody] BulkImportDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ApiResponseDto<BulkImportResult>.ErrorResult("Invalid data", ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));

                var result = await _leadService.BulkImportLeadsAsync(dto);
                return Ok(ApiResponseDto<BulkImportResult>.SuccessResult(result, $"Bulk import completed: {result.SuccessCount} imported, {result.SkippedCount} skipped"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<BulkImportResult>.ErrorResult("Failed to bulk import leads", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Update lead status, notes, etc. (CRM operations)
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponseDto<object>>> UpdateLead(int id, [FromBody] UpdateLeadDto dto)
        {
            try
            {
                dto.Id = id;
                if (!ModelState.IsValid)
                    return BadRequest(ApiResponseDto<object>.ErrorResult("Invalid data", ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
                var lead = await _leadService.UpdateLeadAsync(dto, userId);
                return Ok(ApiResponseDto<object>.SuccessResult(new { leadId = lead.Id }, "Lead updated successfully"));
            }
            catch (ArgumentException ex)
            {
                return NotFound(ApiResponseDto<object>.ErrorResult(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<object>.ErrorResult("Failed to update lead", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Delete lead from CRM
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto>> DeleteLead(int id)
        {
            try
            {
                var success = await _leadService.DeleteLeadAsync(id);
                if (!success)
                    return NotFound(ApiResponseDto.ErrorResult("Lead not found"));
                return Ok(ApiResponseDto.SuccessResult("Lead deleted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto.ErrorResult("Failed to delete lead", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Assign lead to salesperson
        /// </summary>
        [HttpPost("{id}/assign/{salespersonId}")]
        public async Task<ActionResult<ApiResponseDto>> AssignLead(int id, int salespersonId)
        {
            try
            {
                var userId = User.Identity?.Name ?? "";
                var success = await _leadService.AssignLeadAsync(id, salespersonId, userId);
                if (!success)
                    return BadRequest(ApiResponseDto.ErrorResult("Failed to assign lead"));
                return Ok(ApiResponseDto.SuccessResult("Lead assigned successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto.ErrorResult("Failed to assign lead", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Unassign lead from salesperson
        /// </summary>
        [HttpPost("{id}/unassign")]
        public async Task<ActionResult<ApiResponseDto>> UnassignLead(int id)
        {
            try
            {
                var userId = User.Identity?.Name ?? "";
                var success = await _leadService.UnassignLeadAsync(id, userId);
                if (!success)
                    return BadRequest(ApiResponseDto.ErrorResult("Failed to unassign lead"));
                return Ok(ApiResponseDto.SuccessResult("Lead unassigned successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto.ErrorResult("Failed to unassign lead", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Get leads assigned to specific salesperson
        /// </summary>
        [HttpGet("salesperson/{salespersonId}")]
        public async Task<ActionResult<ApiResponseDto<List<CombinedLeadDto>>>> GetLeadsBySalesperson(int salespersonId)
        {
            try
            {
                var leads = await _leadService.GetLeadsBySalespersonAsync(salespersonId);
                return Ok(ApiResponseDto<List<CombinedLeadDto>>.SuccessResult(leads, $"Retrieved {leads.Count} leads for salesperson"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<List<CombinedLeadDto>>.ErrorResult("Failed to retrieve salesperson leads", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Get unassigned leads
        /// </summary>
        [HttpGet("unassigned")]
        public async Task<ActionResult<ApiResponseDto<List<CombinedLeadDto>>>> GetUnassignedLeads()
        {
            try
            {
                var leads = await _leadService.GetUnassignedLeadsAsync();
                return Ok(ApiResponseDto<List<CombinedLeadDto>>.SuccessResult(leads, $"Retrieved {leads.Count} unassigned leads"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<List<CombinedLeadDto>>.ErrorResult("Failed to retrieve unassigned leads", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Get leads requiring follow-up
        /// </summary>
        [HttpGet("follow-up")]
        public async Task<ActionResult<ApiResponseDto<List<CombinedLeadDto>>>> GetFollowUpLeads()
        {
            try
            {
                var leads = await _leadService.GetFollowUpLeadsAsync();
                return Ok(ApiResponseDto<List<CombinedLeadDto>>.SuccessResult(leads, $"Retrieved {leads.Count} leads requiring follow-up"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<List<CombinedLeadDto>>.ErrorResult("Failed to retrieve follow-up leads", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Get available sources from scraper database
        /// </summary>
        [HttpGet("sources")]
        public async Task<ActionResult<ApiResponseDto<List<string>>>> GetAvailableSources()
        {
            try
            {
                var sources = await _leadService.GetAvailableSourcesAsync();
                var allSources = new List<string> { "YellowPages" };
                allSources.AddRange(sources.Where(s => !allSources.Contains(s)));
                return Ok(ApiResponseDto<List<string>>.SuccessResult(allSources.Distinct().ToList(), "Available sources retrieved"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<List<string>>.ErrorResult("Failed to retrieve sources", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Get lead statistics by status
        /// </summary>
        [HttpGet("stats/status")]
        public async Task<ActionResult<ApiResponseDto<Dictionary<string, int>>>> GetLeadStatsByStatus()
        {
            try
            {
                var stats = await _leadService.GetLeadStatsByStatusAsync();
                return Ok(ApiResponseDto<Dictionary<string, int>>.SuccessResult(stats, "Lead status statistics retrieved"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<Dictionary<string, int>>.ErrorResult("Failed to retrieve status statistics", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Get lead statistics by source
        /// </summary>
        [HttpGet("stats/source")]
        public async Task<ActionResult<ApiResponseDto<Dictionary<string, int>>>> GetLeadStatsBySource()
        {
            try
            {
                var stats = await _leadService.GetLeadStatsBySourceAsync();
                return Ok(ApiResponseDto<Dictionary<string, int>>.SuccessResult(stats, "Lead source statistics retrieved"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<Dictionary<string, int>>.ErrorResult("Failed to retrieve source statistics", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Get team workload data for dashboard
        /// </summary>
        [HttpGet("assignment/workload")]
        public async Task<ActionResult<ApiResponseDto<List<SalespersonWorkloadDto>>>> GetTeamWorkload()
        {
            try
            {
                var workload = await _leadService.GetTeamWorkloadAsync();
                return Ok(ApiResponseDto<List<SalespersonWorkloadDto>>.SuccessResult(workload, "Team workload retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<List<SalespersonWorkloadDto>>.ErrorResult("Failed to retrieve team workload", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Get all assignment rules
        /// </summary>
        [HttpGet("assignment/rules")]
        public async Task<ActionResult<ApiResponseDto<List<AssignmentRuleDto>>>> GetAssignmentRules()
        {
            try
            {
                var rules = await _leadService.GetAssignmentRulesAsync();
                return Ok(ApiResponseDto<List<AssignmentRuleDto>>.SuccessResult(rules, "Assignment rules retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<List<AssignmentRuleDto>>.ErrorResult("Failed to retrieve assignment rules", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Create new assignment rule
        /// </summary>
        [HttpPost("assignment/rules")]
        public async Task<ActionResult<ApiResponseDto<object>>> CreateAssignmentRule([FromBody] CreateAssignmentRuleDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ApiResponseDto<object>.ErrorResult("Invalid data", ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
                var rule = await _leadService.CreateAssignmentRuleAsync(dto, userId);
                return Ok(ApiResponseDto<object>.SuccessResult(new { ruleId = rule.Id }, "Assignment rule created successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<object>.ErrorResult("Failed to create assignment rule", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Update assignment rule
        /// </summary>
        [HttpPut("assignment/rules/{id}")]
        public async Task<ActionResult<ApiResponseDto>> UpdateAssignmentRule(int id, [FromBody] UpdateAssignmentRuleDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ApiResponseDto.ErrorResult("Invalid data", ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));

                var success = await _leadService.UpdateAssignmentRuleAsync(id, dto);
                if (!success)
                    return NotFound(ApiResponseDto.ErrorResult("Assignment rule not found"));
                return Ok(ApiResponseDto.SuccessResult("Assignment rule updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto.ErrorResult("Failed to update assignment rule", new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Delete assignment rule
        /// </summary>
        [HttpDelete("assignment/rules/{id}")]
        public async Task<ActionResult<ApiResponseDto>> DeleteAssignmentRule(int id)
        {
            try
            {
                var success = await _leadService.DeleteAssignmentRuleAsync(id);
                if (!success)
                    return NotFound(ApiResponseDto.ErrorResult("Assignment rule not found"));
                return Ok(ApiResponseDto.SuccessResult("Assignment rule deleted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto.ErrorResult("Failed to delete assignment rule", new List<string> { ex.Message }));
            }
        }
    }
}
