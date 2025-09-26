namespace RandomSubjectsApi.DTOs;

public class DocumentDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<string> Subjects { get; set; } = new();
}

public class CreateDocumentDto
{
    public string Name { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string> Subjects { get; set; } = new();
}

public class UpdateDocumentDto
{
    public string? Name { get; set; }
    public string? Content { get; set; }
    public List<string>? Subjects { get; set; }
}

public class RandomSubjectsRequest
{
    public int Count { get; set; }
    public List<int>? DocumentIds { get; set; }
}