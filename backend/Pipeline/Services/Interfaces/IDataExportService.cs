using Pipeline.DTOs.Leads;

namespace Pipeline.Services.Interfaces
{
    public interface IDataExportService
    {
        Task<byte[]> ExportLeadsToCsvAsync(LeadFilterDto? filter = null);
        Task<byte[]> ExportLeadsToExcelAsync(LeadFilterDto? filter = null);
        Task<int> ImportLeadsFromCsvAsync(Stream csvStream, string userId);
    }
}
