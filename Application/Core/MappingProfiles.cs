#nullable disable

using Application.DTOs;
using AutoMapper;
using Domain.Entities;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();

            CreateMap<Activity, ActivityDto>()
                .ForMember(dest => dest.HostUsername, o => o
                    .MapFrom(s => s.Attendees
                        .FirstOrDefault(x => x.IsHost).User.UserName));

            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(d => d.DisplayName, o => o
                    .MapFrom(s => s.User.DisplayName))
                .ForMember(d => d.Username, o => o
                    .MapFrom(s => s.User.UserName))
                .ForMember(d => d.Bio, o => o
                    .MapFrom(s => s.User.Bio));
        }
    }
}