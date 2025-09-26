using AutoMapper;
using RandomSubjectsApi.DTOs;
using RandomSubjectsApi.Models;

namespace RandomSubjectsApi.Profiles;

public class TestProfile : Profile
{
    public TestProfile()
    {
        CreateMap<Test, TestDto>()
            .ForMember(dest => dest.Exercises, opt => opt.MapFrom(src =>
                src.TestExercises.OrderBy(te => te.Order).Select(te => te.Exercise)));

        CreateMap<Test, TestWithExercisesDto>()
            .ForMember(dest => dest.Exercises, opt => opt.MapFrom(src =>
                src.TestExercises.OrderBy(te => te.Order).Select(te => te.Exercise)));

        CreateMap<CreateTestDto, Test>();
    }
}