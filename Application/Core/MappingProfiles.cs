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

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o
                    .MapFrom(s => s.User.DisplayName))
                .ForMember(d => d.Username, o => o
                    .MapFrom(s => s.User.UserName))
                .ForMember(d => d.Bio, o => o
                    .MapFrom(s => s.User.Bio))
                .ForMember(d => d.Image, o => o
                    .MapFrom(s => s.User.Photos.FirstOrDefault(p => p.IsMain).Url));

            CreateMap<User, Profiles.Profile>()
                .ForMember(d => d.Image, o => o
                    .MapFrom(s => s.Photos.FirstOrDefault(p => p.IsMain).Url));

            /*CreateMap<Profiles.Profile, User>()
                .ForMember(d => d.DisplayName, o => o
                    .MapFrom(s => s.DisplayName))
                .ForMember(d => d.Bio, o => o
                    .MapFrom(s => s.Bio));*/
        }
    }
}