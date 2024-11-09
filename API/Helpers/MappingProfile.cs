using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<User, MemberDto>()
            .ForMember(dest => dest.Followers, opt => opt.MapFrom(src => src.Followers.Select(f => new FollowerDto
            {
                Id = f.FollowingUser.Id,
                Username = f.FollowingUser.UserName,
                ProfilePicture = f.FollowingUser.ProfilePicture
            }).ToList()))
                .ForMember(dest => dest.Followees, opt => opt.MapFrom(src => src.Following.Select(f => new FollowerDto
                {
                    Id = f.FollowedUser.Id,
                    Username = f.FollowedUser.UserName,
                    ProfilePicture = f.FollowedUser.ProfilePicture
                }).ToList()));

        CreateMap<Travel, TravelDto>()
            .ForMember(d => d.PhotoUrls, o => o.MapFrom(s => s.Photos.Select(p => p.Url).ToList()));

        CreateMap<Travel, TravelDetailDto>()
            .ForMember(d => d.Username, opt => opt.MapFrom(src => src.User.UserName))
            .ForMember(d => d.DateOfBirth, opt => opt.MapFrom(src => src.User.DateOfBirth))
            .ForMember(d => d.ProfilePicture, opt => opt.MapFrom(src => src.User.ProfilePicture))
            .ForMember(d => d.PhotoUrls, o => o.MapFrom(s => s.Photos.Select(p => p.Url).ToList()));


        CreateMap<Photo, PhotoDto>();
        CreateMap<Place, PlaceDto>();
        CreateMap<UpdateUserDto, User>();
        CreateMap<CreateTravelDto, Travel>()
            .ForMember(d => d.CreatedAt, opt => opt.MapFrom(x => DateTime.Now));
    }
}