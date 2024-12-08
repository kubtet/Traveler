using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<User, MemberDto>()
            .ForMember(dest => dest.ProfilePhotoUrl, opt => opt.MapFrom(src => src.ProfilePhoto != null && src.ProfilePhoto.IsProfilePicture ? src.ProfilePhoto.Url : null))
            .ForMember(dest => dest.Followers, opt => opt.MapFrom(src => src.Followers.Select(f => new FollowerDto
            {
                Id = f.SourceUser.Id,
                Username = f.SourceUser.UserName,
                ProfilePhoto = f.SourceUser.ProfilePhoto != null ? f.SourceUser.ProfilePhoto.Url : null,
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
            .ForMember(d => d.PhotoUrls, o => o.MapFrom(s => s.Photos.Select(p => p.Url).ToList()));
        CreateMap<Photo, PhotoDto>();
        CreateMap<UpdateUserDto, User>();
        CreateMap<CreateTravelDto, Travel>()
            .ForMember(d => d.CreatedAt, opt => opt.MapFrom(x => DateTime.Now));
        CreateMap<Message, MessageDto>()
            .ForMember(d => d.SenderPhotoUrl, o => o.MapFrom(s => s.Sender.ProfilePhoto != null ? s.Sender.ProfilePhoto.Url : null))
            .ForMember(d => d.RecipientPhotoUrl, o => o.MapFrom(s => s.Recipient.ProfilePhoto != null ? s.Recipient.ProfilePhoto.Url : null));
        CreateMap<Travel, TravelTimelineDto>()
            .ForMember(d => d.Country, o => o.MapFrom(s => s.CountryName));
    }
}