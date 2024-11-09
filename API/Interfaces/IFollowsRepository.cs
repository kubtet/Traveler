namespace API;

using API.DTOs;
using API.Entities;

public interface IFollowsRepository
{
    Task<Follow?> GetUserFollow(int sourceUserId, int FollowedUserId); // chcek if source user is giving follow to target user (followedUser)
    Task<IEnumerable<MemberDto>> GetTravelLikes(string predicate, int travelId);
    Task<IEnumerable<int>> GetCurrentTravelLikeIds(int currenTravelId);

    void DeleteFollow(Follow follow);
    void AddFollow(Follow follow);
    Task<bool> SaveChanges();

}