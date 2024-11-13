namespace API;

using API.DTOs;
using API.Entities;

public interface IFollowsRepository
{
    void AddFollow(Follow follow);
    void DeleteFollow(Follow follow);
    Task<Follow?> GetFollow(int followerId, int followingId);
    Task<IEnumerable<MemberDto>> GetFollowers(int userId);
    Task<IEnumerable<MemberDto>> GetFollowings(int userId);
    Task<int> CountFollowers(int userId);
    Task<int> CountFollowings(int userId);
    Task<bool> SaveChangesAsync();
}