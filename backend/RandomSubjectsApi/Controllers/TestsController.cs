using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RandomSubjectsApi.Data;
using RandomSubjectsApi.DTOs;
using RandomSubjectsApi.Models;
using AutoMapper;

namespace RandomSubjectsApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public TestsController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TestDto>>> GetTests()
    {
        var tests = await _context.Tests
            .Include(t => t.TestExercises)
            .ThenInclude(te => te.Exercise)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<TestDto>>(tests));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TestWithExercisesDto>> GetTest(int id)
    {
        var test = await _context.Tests
            .Include(t => t.TestExercises.OrderBy(te => te.Order))
            .ThenInclude(te => te.Exercise)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (test == null)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<TestWithExercisesDto>(test));
    }

    [HttpPost]
    public async Task<ActionResult<TestDto>> CreateTest(CreateTestDto createTestDto)
    {
        var test = _mapper.Map<Test>(createTestDto);
        test.CreatedAt = DateTime.UtcNow;
        test.UpdatedAt = DateTime.UtcNow;

        _context.Tests.Add(test);
        await _context.SaveChangesAsync();

        // If specific exercise IDs are provided, use them; otherwise select random exercises
        List<Exercise> selectedExercises;
        if (createTestDto.ExerciseIds != null && createTestDto.ExerciseIds.Any())
        {
            selectedExercises = await _context.Exercises
                .Where(e => createTestDto.ExerciseIds.Contains(e.Id))
                .Take(createTestDto.ExerciseCount)
                .ToListAsync();
        }
        else
        {
            // Select random exercises based on tags if provided
            var exercisesQuery = _context.Exercises.AsQueryable();

            if (createTestDto.Tags != null && createTestDto.Tags.Any())
            {
                exercisesQuery = exercisesQuery.Where(e => createTestDto.Tags.Any(tag => e.Tags.Contains(tag)));
            }

            var allExercises = await exercisesQuery.ToListAsync();
            selectedExercises = allExercises.OrderBy(x => Guid.NewGuid()).Take(createTestDto.ExerciseCount).ToList();
        }

        // Create TestExercise relationships
        for (int i = 0; i < selectedExercises.Count; i++)
        {
            var testExercise = new TestExercise
            {
                TestId = test.Id,
                ExerciseId = selectedExercises[i].Id,
                Order = i + 1,
                AddedAt = DateTime.UtcNow
            };
            _context.TestExercises.Add(testExercise);
        }

        await _context.SaveChangesAsync();

        // Return the test with exercises
        var createdTest = await _context.Tests
            .Include(t => t.TestExercises)
            .ThenInclude(te => te.Exercise)
            .FirstAsync(t => t.Id == test.Id);

        var testDto = _mapper.Map<TestDto>(createdTest);
        return CreatedAtAction(nameof(GetTest), new { id = test.Id }, testDto);
    }

    [HttpPost("generate")]
    public async Task<ActionResult<TestWithExercisesDto>> GenerateRandomTest([FromBody] CreateTestDto createTestDto)
    {
        // This endpoint specifically generates a test with random exercises for immediate practice
        var exercisesQuery = _context.Exercises.AsQueryable();

        if (createTestDto.Tags != null && createTestDto.Tags.Any())
        {
            exercisesQuery = exercisesQuery.Where(e => createTestDto.Tags.Any(tag => e.Tags.Contains(tag)));
        }

        var allExercises = await exercisesQuery.ToListAsync();

        if (allExercises.Count == 0)
        {
            return BadRequest("No exercises found matching the criteria.");
        }

        var exerciseCount = Math.Min(createTestDto.ExerciseCount, allExercises.Count);
        var selectedExercises = allExercises.OrderBy(x => Guid.NewGuid()).Take(exerciseCount).ToList();

        // Create a temporary test response without saving to database
        var tempTest = new TestWithExercisesDto
        {
            Id = 0, // Temporary ID
            Name = createTestDto.Name,
            Description = createTestDto.Description,
            CreatedAt = DateTime.UtcNow,
            Exercises = _mapper.Map<List<ExerciseDto>>(selectedExercises)
        };

        return Ok(tempTest);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTest(int id)
    {
        var test = await _context.Tests.FindAsync(id);

        if (test == null)
        {
            return NotFound();
        }

        _context.Tests.Remove(test);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TestExists(int id)
    {
        return _context.Tests.Any(e => e.Id == id);
    }
}