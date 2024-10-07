using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API;

public class MappingProfile : Profile
{
    public MappingProfile()
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
            .ForMember(d => d.PhotosUrl, o => o.MapFrom(s => s.Photos.Select(p => p.Url).ToList()))
            .ForMember(d => d.PlacesNames, o => o.MapFrom(s => s.TravelPlaces.Select(tp => tp.Place).ToList()));


        CreateMap<Photo, PhotoDto>();
        CreateMap<Place, PlaceDto>();
        CreateMap<UpdateUserDto, User>();
    }
}