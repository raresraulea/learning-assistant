using Microsoft.AspNetCore.Mvc;
using RandomSubjectsApi.DTOs;
using RandomSubjectsApi.Services;

namespace RandomSubjectsApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _documentService;

    public DocumentsController(IDocumentService documentService)
    {
        _documentService = documentService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DocumentDto>>> GetDocuments()
    {
        var documents = await _documentService.GetAllDocumentsAsync();
        return Ok(documents);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DocumentDto>> GetDocument(int id)
    {
        var document = await _documentService.GetDocumentByIdAsync(id);
        if (document == null)
        {
            return NotFound();
        }
        return Ok(document);
    }

    [HttpPost]
    public async Task<ActionResult<DocumentDto>> CreateDocument(CreateDocumentDto createDocumentDto)
    {
        var document = await _documentService.CreateDocumentAsync(createDocumentDto);
        return CreatedAtAction(nameof(GetDocument), new { id = document.Id }, document);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<DocumentDto>> UpdateDocument(int id, UpdateDocumentDto updateDocumentDto)
    {
        var document = await _documentService.UpdateDocumentAsync(id, updateDocumentDto);
        if (document == null)
        {
            return NotFound();
        }
        return Ok(document);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDocument(int id)
    {
        var result = await _documentService.DeleteDocumentAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpPost("random-subjects")]
    public async Task<ActionResult<List<string>>> GetRandomSubjects(RandomSubjectsRequest request)
    {
        if (request.Count <= 0)
        {
            return BadRequest("Count must be greater than 0");
        }

        var subjects = await _documentService.GetRandomSubjectsAsync(request);
        return Ok(subjects);
    }
}