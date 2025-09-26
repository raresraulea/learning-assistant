using RandomSubjectsApi.DTOs;

namespace RandomSubjectsApi.Services;

public interface IDocumentService
{
    Task<IEnumerable<DocumentDto>> GetAllDocumentsAsync();
    Task<DocumentDto?> GetDocumentByIdAsync(int id);
    Task<DocumentDto> CreateDocumentAsync(CreateDocumentDto createDocumentDto);
    Task<DocumentDto?> UpdateDocumentAsync(int id, UpdateDocumentDto updateDocumentDto);
    Task<bool> DeleteDocumentAsync(int id);
    Task<List<string>> GetRandomSubjectsAsync(RandomSubjectsRequest request);
}