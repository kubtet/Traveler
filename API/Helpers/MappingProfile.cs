using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<User, MemberDto>()
            .ForMember(dest => dest.ProfilePhotoUrl, opt => opt.MapFrom(src =>
        src.ProfilePhoto != null && src.ProfilePhoto.IsProfilePicture ? src.ProfilePhoto.Url : null))
            .ForMember(dest => dest.Followers, opt => opt.MapFrom(src => src.Followers.Select(f => new FollowerDto
            {
                Id = f.FollowingUser.Id,
                Username = f.FollowingUser.UserName,
                ProfilePhoto = f.FollowingUser.ProfilePhoto != null ? f.FollowingUser.ProfilePhoto.Url : null,
            }).ToList()))
                .ForMember(dest => dest.Followees, opt => opt.MapFrom(src => src.Following.Select(f => new FollowerDto
                {
                    Id = f.FollowedUser.Id,
                    Username = f.FollowedUser.UserName,
                    ProfilePhoto = f.FollowedUser.ProfilePhoto != null ? f.FollowedUser.ProfilePhoto.Url : null,
                }).ToList()));

        CreateMap<Travel, TravelDto>()
            .ForMember(d => d.PhotoUrls, o => o.MapFrom(s => s.Photos.Select(p => p.Url).ToList()));

        CreateMap<Travel, TravelDetailDto>()
            .ForMember(d => d.Username, opt => opt.MapFrom(src => src.User.UserName))
            .ForMember(d => d.DateOfBirth, opt => opt.MapFrom(src => src.User.DateOfBirth))
            .ForMember(d => d.ProfilePicture, opt => opt.MapFrom(src => src.User.ProfilePhoto != null ? src.User.ProfilePhoto.Url : null))
            .ForMember(d => d.PhotoUrls, o => o.MapFrom(s => s.Photos.Select(p => p.Url).ToList()))
            .ForMember(d => d.PlaceNames, o => o.MapFrom(s => s.TravelPlaces.Select(tp => tp.Place.Name).ToList()));


        CreateMap<Photo, PhotoDto>();
        CreateMap<Place, PlaceDto>();
        CreateMap<UpdateUserDto, User>();
    }
}