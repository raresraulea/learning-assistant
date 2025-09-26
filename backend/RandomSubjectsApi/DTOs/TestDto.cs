namespace RandomSubjectsApi.DTOs;

public class TestDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int ExerciseCount { get; set; }
    public List<string> Tags { get; set; } = new();
    public List<ExerciseDto> Exercises { get; set; } = new();
}

public class CreateTestDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int ExerciseCount { get; set; }
    public List<string> Tags { get; set; } = new();
    public List<int>? ExerciseIds { get; set; } // Optional: specify exact exercises
}

public class TestWithExercisesDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<ExerciseDto> Exercises { get; set; } = new();
}