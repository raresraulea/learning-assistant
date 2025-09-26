namespace RandomSubjectsApi.Models;

public class TestExercise
{
    public int TestId { get; set; }
    public Test Test { get; set; } = null!;

    public int ExerciseId { get; set; }
    public Exercise Exercise { get; set; } = null!;

    public int Order { get; set; } // Order of exercise in the test
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}