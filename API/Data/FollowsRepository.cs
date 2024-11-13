using API;
using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

public class FollowsRepository(DataContext context, IMapper mapper) : IFollowsRepository
{
    public void AddFollow(Follow follow)
    {
        context.Follows.Add(follow);
    }
    public void DeleteFollow(Follow follow)
    {
        context.Follows.Remove(follow);
    }

    public async Task<Follow?> GetFollow(int followerId, int followingId)
    {
        return await context.Follows.FindAsync(followerId, followingId);
    }

    public async Task<int> CountFollowers(int userId)
    {
        return await context.Follows
        .CountAsync(f => f.FollowedUserId == userId);

    }

    public async Task<int> CountFollowings(int userId)
    {
        return await context.Follows
        .CountAsync(f => f.SourceUserId == userId);
    }

    public async Task<IEnumerable<MemberDto>> GetFollowers(int userId)
    {
        return await context.Follows
        .Where(f => f.FollowedUserId == userId)
        .Select(f => f.SourceUser)
        .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
        .ToListAsync();
    }

    public async Task<IEnumerable<MemberDto>> GetFollowings(int userId)
    {
        return await context.Follows
        .Where(f => f.SourceUserId == userId)
        .Select(f => f.FollowedUser)
        .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
        .ToListAsync();
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}