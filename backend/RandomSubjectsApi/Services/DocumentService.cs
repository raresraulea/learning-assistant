using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RandomSubjectsApi.Data;
using RandomSubjectsApi.DTOs;
using RandomSubjectsApi.Models;

namespace RandomSubjectsApi.Services;

public class DocumentService : IDocumentService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public DocumentService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<DocumentDto>> GetAllDocumentsAsync()
    {
        var documents = await _context.Documents.ToListAsync();
        return _mapper.Map<IEnumerable<DocumentDto>>(documents);
    }

    public async Task<DocumentDto?> GetDocumentByIdAsync(int id)
    {
        var document = await _context.Documents.FindAsync(id);
        return document == null ? null : _mapper.Map<DocumentDto>(document);
    }

    public async Task<DocumentDto> CreateDocumentAsync(CreateDocumentDto createDocumentDto)
    {
        var document = _mapper.Map<Document>(createDocumentDto);
        document.CreatedAt = DateTime.UtcNow;
        document.UpdatedAt = DateTime.UtcNow;

        _context.Documents.Add(document);
        await _context.SaveChangesAsync();

        return _mapper.Map<DocumentDto>(document);
    }

    public async Task<DocumentDto?> UpdateDocumentAsync(int id, UpdateDocumentDto updateDocumentDto)
    {
        var document = await _context.Documents.FindAsync(id);
        if (document == null) return null;

        _mapper.Map(updateDocumentDto, document);
        document.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return _mapper.Map<DocumentDto>(document);
    }

    public async Task<bool> DeleteDocumentAsync(int id)
    {
        var document = await _context.Documents.FindAsync(id);
        if (document == null) return false;

        _context.Documents.Remove(document);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<string>> GetRandomSubjectsAsync(RandomSubjectsRequest request)
    {
        var query = _context.Documents.AsQueryable();

        if (request.DocumentIds != null && request.DocumentIds.Any())
        {
            query = query.Where(d => request.DocumentIds.Contains(d.Id));
        }

        var documents = await query.ToListAsync();
        var allSubjects = documents.SelectMany(d => d.Subjects).Distinct().ToList();

        if (request.Count >= allSubjects.Count)
        {
            return allSubjects;
        }

        var random = new Random();
        return allSubjects.OrderBy(x => random.Next()).Take(request.Count).ToList();
    }
}