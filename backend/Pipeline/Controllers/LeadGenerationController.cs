using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Pipeline.DTOs.Leads;
using Pipeline.DTOs.Scraping;
using Pipeline.DTOs.Common;
using Pipeline.Services.Interfaces;
using System.Security.Claims;

namespace Pipeline.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LeadGenerationController : ControllerBase
    {
        private readonly IPythonScriptService _pythonScriptService;
        private readonly IMLScoringService _mlScoringService;
        private readonly IDataExportService _dataExportService;

        public LeadGenerationController(
            IPythonScriptService pythonScriptService,
            IMLScoringService mlScoringService,
            IDataExportService dataExportService)
        {
            _pythonScriptService = pythonScriptService;
            _mlScoringService = mlScoringService;
            _dataExportService = dataExportService;
        }

        [HttpPost("start")]
        public async Task<ActionResult<ApiResponseDto<object>>> StartLeadGeneration([FromBody] GenerateLeadsDto generateLeadsDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            try
            {
                var session = await _pythonScriptService.StartScrapingSessionAsync(generateLeadsDto, userId);
                return Ok(ApiResponseDto<object>.SuccessResult(
                    new { sessionId = session.Id, message = "Lead generation started successfully" },
                    "Scraping session initiated"
                ));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponseDto<object>.ErrorResult(ex.Message));
            }
        }

        [HttpPost("{sessionId}/stop")]
        public async Task<ActionResult<ApiResponseDto>> StopLeadGeneration(int sessionId)
        {
            var success = await _pythonScriptService.StopScrapingSessionAsync(sessionId);
            if (!success)
                return BadRequest(ApiResponseDto.ErrorResult("Failed to stop scraping session"));
            return Ok(ApiResponseDto.SuccessResult("Scraping session stopped"));
        }

        [HttpGet("{sessionId}/progress")]
        public async Task<ActionResult<ApiResponseDto<ScrapingProgressDto>>> GetScrapingProgress(int sessionId)
        {
            var progress = await _pythonScriptService.GetScrapingProgressAsync(sessionId);
            if (progress == null)
                return NotFound(ApiResponseDto<ScrapingProgressDto>.ErrorResult("Scraping session not found"));
            return Ok(ApiResponseDto<ScrapingProgressDto>.SuccessResult(progress));
        }

        [HttpGet("sessions")]
        public async Task<ActionResult<ApiResponseDto<List<ScrapingSessionDto>>>> GetScrapingSessions()
        {
            var sessions = await _pythonScriptService.GetScrapingSessionsAsync();
            return Ok(ApiResponseDto<List<ScrapingSessionDto>>.SuccessResult(sessions));
        }

        [HttpGet("sessions/{sessionId}")]
        public async Task<ActionResult<ApiResponseDto<ScrapingSessionDto>>> GetScrapingSession(int sessionId)
        {
            var session = await _pythonScriptService.GetScrapingSessionByIdAsync(sessionId);
            if (session == null)
                return NotFound(ApiResponseDto<ScrapingSessionDto>.ErrorResult("Session not found"));
            return Ok(ApiResponseDto<ScrapingSessionDto>.SuccessResult(session));
        }

        [HttpPost("score/{leadId}")]
        public async Task<ActionResult<ApiResponseDto<MLPredictionDto>>> ScoreLead(int leadId)
        {
            try
            {
                var prediction = await _mlScoringService.ScoreLeadAsync(leadId);
                return Ok(ApiResponseDto<MLPredictionDto>.SuccessResult(prediction, "Lead scored successfully"));
            }
            catch (ArgumentException ex)
            {
                return NotFound(ApiResponseDto<MLPredictionDto>.ErrorResult(ex.Message));
            }
        }

        [AllowAnonymous]
        [HttpPost("bulk-score")]
        public async Task<ActionResult<ApiResponseDto<List<MLPredictionDto>>>> BulkScoreLeads([FromBody] BulkMLPredictionDto bulkRequest)
        {
            var predictions = await _mlScoringService.BulkScoreLeadsAsync(bulkRequest);
            return Ok(ApiResponseDto<List<MLPredictionDto>>.SuccessResult(predictions,
                $"Scored {predictions.Count} leads successfully"));
        }

        [HttpPost("train-model")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<ApiResponseDto>> TrainModel()
        {
            var success = await _mlScoringService.TrainModelAsync();
            if (!success)
                return BadRequest(ApiResponseDto.ErrorResult("Failed to train model"));
            return Ok(ApiResponseDto.SuccessResult("Model training started"));
        }

        [HttpGet("model-accuracy")]
        public async Task<ActionResult<ApiResponseDto<object>>> GetModelAccuracy()
        {
            var accuracy = await _mlScoringService.GetModelAccuracyAsync();
            var features = await _mlScoringService.GetModelFeaturesAsync();
            return Ok(ApiResponseDto<object>.SuccessResult(new { accuracy, features }));
        }

        [HttpGet("export/csv")]
        public async Task<IActionResult> ExportLeadsCsv([FromQuery] LeadFilterDto? filter = null)
        {
            var csvData = await _dataExportService.ExportLeadsToCsvAsync(filter);
            return File(csvData, "text/csv", $"leads-export-{DateTime.Now:yyyy-MM-dd}.csv");
        }

        [HttpGet("export/excel")]
        public async Task<IActionResult> ExportLeadsExcel([FromQuery] LeadFilterDto? filter = null)
        {
            var excelData = await _dataExportService.ExportLeadsToExcelAsync(filter);
            return File(excelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"leads-export-{DateTime.Now:yyyy-MM-dd}.xlsx");
        }

        [HttpPost("import/csv")]
        public async Task<ActionResult<ApiResponseDto<object>>> ImportLeadsFromCsv(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(ApiResponseDto<object>.ErrorResult("No file uploaded"));

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            try
            {
                using var stream = file.OpenReadStream();
                var importedCount = await _dataExportService.ImportLeadsFromCsvAsync(stream, userId);
                return Ok(ApiResponseDto<object>.SuccessResult(
                    new { importedCount },
                    $"Successfully imported {importedCount} leads"
                ));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseDto<object>.ErrorResult($"Import failed: {ex.Message}"));
            }
        }

        [HttpGet("config")]
        public ActionResult<ApiResponseDto<object>> GetGenerationConfig()
        {
            var config = new
            {
                availableNiches = new[] { "contractors", "roofers", "plumbers", "electricians", "hvac", "painters", "landscapers", "general_contractors" },
                supportedLocations = new[] { "Eugene, OR", "Portland, OR", "Salem, OR", "Bend, OR", "Medford, OR", "Springfield, OR" },
                maxLeadsPerSession = 250,
                minDelaySeconds = 4,
                maxDelaySeconds = 8,
                estimatedTimePerLead = 8 // seconds
            };
            return Ok(ApiResponseDto<object>.SuccessResult(config));
        }
    }
}
