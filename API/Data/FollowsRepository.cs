
using API;
using API.Data;
using API.DTOs;
using API.Entities;

public class FollowsRepository(DataContext context) : IFollowsRepository
{
    public void AddFollow(Follow follow)
    {
        context.Follows.Add(follow);
    }

    public void DeleteFollow(Follow follow)
    {
        context.Follows.Remove(follow);
    }

    public async Task<IEnumerable<int>> GetCurrentTravelLikeIds(int currenTravelId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<MemberDto>> GetTravelLikes(string predicate, int travelId)
    {
        throw new NotImplementedException();
    }

    public Task<Follow?> GetUserFollow(int sourceUserId, int FollowedUserId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> SaveChanges()
    {
        throw new NotImplementedException();
    }
}