using API.Data;
using API.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class LikesRepository(DataContext context, IMapper mapper) : ILikesRepository
{
    public void AddLike(TravelLike like)
    {
        context.TravelLikes.Add(like);
    }

    public void DeleteLike(TravelLike like)
    {
        context.TravelLikes.Remove(like);

    }

    public async Task<int> CountLikesForTravel(int travelId)
    {
        return await context.TravelLikes.CountAsync(l => l.TravelId == travelId);
    }

    public async Task<IEnumerable<int>> GetCurrentTravelLikeIds(int currentTravelId)
    {
        return await context.TravelLikes
        .Where(x => x.TravelId == currentTravelId)
        .Select(x => x.UserId)
        .ToListAsync();
    }

    public async Task<TravelLike?> GetTravelLikeByUser(int travelId, int userId)
    {
        return await context.TravelLikes
       .Where(l => l.TravelId == travelId && l.UserId == userId)
       .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<MemberDto>> GetUsersWhoLikedTravel(int travelId)
    {
        return await context.TravelLikes
        .Where(x => x.TravelId == travelId)
        .Select(x => x.User)
        .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
        .ToListAsync();
    }
}