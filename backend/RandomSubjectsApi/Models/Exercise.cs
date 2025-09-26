using System.ComponentModel.DataAnnotations;

namespace RandomSubjectsApi.Models;

public class Exercise
{
    public int Id { get; set; }

    [Required]
    [StringLength(255)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<string> Tags { get; set; } = new();

    // Navigation properties
    public ICollection<TestExercise> TestExercises { get; set; } = new List<TestExercise>();
}