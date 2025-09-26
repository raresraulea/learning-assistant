namespace RandomSubjectsApi.DTOs;

public class ExerciseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<string> Tags { get; set; } = new();
}

public class CreateExerciseDto
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<string> Tags { get; set; } = new();
}

public class UpdateExerciseDto
{
    public string? Title { get; set; }
    public string? Content { get; set; }
    public string? Description { get; set; }
    public List<string>? Tags { get; set; }
}