using System.ComponentModel.DataAnnotations;

namespace RandomSubjectsApi.Models;

public class Test
{
    public int Id { get; set; }

    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public int ExerciseCount { get; set; }

    public List<string> Tags { get; set; } = new();

    // Navigation properties
    public ICollection<TestExercise> TestExercises { get; set; } = new List<TestExercise>();
}