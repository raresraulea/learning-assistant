using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RandomSubjectsApi.Data;
using RandomSubjectsApi.DTOs;
using RandomSubjectsApi.Models;
using AutoMapper;

namespace RandomSubjectsApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExercisesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ExercisesController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExerciseDto>>> GetExercises()
    {
        var exercises = await _context.Exercises.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<ExerciseDto>>(exercises));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ExerciseDto>> GetExercise(int id)
    {
        var exercise = await _context.Exercises.FindAsync(id);

        if (exercise == null)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<ExerciseDto>(exercise));
    }

    [HttpPost]
    public async Task<ActionResult<ExerciseDto>> CreateExercise(CreateExerciseDto createExerciseDto)
    {
        var exercise = _mapper.Map<Exercise>(createExerciseDto);
        exercise.CreatedAt = DateTime.UtcNow;
        exercise.UpdatedAt = DateTime.UtcNow;

        _context.Exercises.Add(exercise);
        await _context.SaveChangesAsync();

        var exerciseDto = _mapper.Map<ExerciseDto>(exercise);
        return CreatedAtAction(nameof(GetExercise), new { id = exercise.Id }, exerciseDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateExercise(int id, UpdateExerciseDto updateExerciseDto)
    {
        var exercise = await _context.Exercises.FindAsync(id);

        if (exercise == null)
        {
            return NotFound();
        }

        _mapper.Map(updateExerciseDto, exercise);
        exercise.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ExerciseExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExercise(int id)
    {
        var exercise = await _context.Exercises.FindAsync(id);

        if (exercise == null)
        {
            return NotFound();
        }

        _context.Exercises.Remove(exercise);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<ExerciseDto>>> SearchExercises([FromQuery] string? query, [FromQuery] List<string>? tags)
    {
        var exercisesQuery = _context.Exercises.AsQueryable();

        if (!string.IsNullOrEmpty(query))
        {
            exercisesQuery = exercisesQuery.Where(e => e.Title.Contains(query) || e.Content.Contains(query));
        }

        if (tags != null && tags.Any())
        {
            exercisesQuery = exercisesQuery.Where(e => tags.Any(tag => e.Tags.Contains(tag)));
        }

        var exercises = await exercisesQuery.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<ExerciseDto>>(exercises));
    }

    private bool ExerciseExists(int id)
    {
        return _context.Exercises.Any(e => e.Id == id);
    }
}