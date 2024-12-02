using API.Data;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class UserRepository(DataContext context) : IUserRepository
{
    public async Task<User?> GetUserByIdAsync(int id)
    {
        return await context.Users
            .Include(x => x.Travels)
            .Include(u => u.ProfilePhoto)
            .SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await context.Users
            .Include(x => x.Travels)
            .Include(u => u.ProfilePhoto)
            .SingleOrDefaultAsync(x => x.UserName!.ToLower() == username.ToLower());
    }

    public async Task<PagedList<User>> GetUsersAsync(DataParams dataParams)
    {
        var query = context.Users
            .Include(u => u.ProfilePhoto)
            .Include(u => u.Followers)
            .ThenInclude(f => f.SourceUser)
            .Include(u => u.Following)
            .ThenInclude(f => f.FollowedUser)
            .Include(u => u.Travels)
            .ThenInclude(t => t.Photos)
            .Include(u => u.Travels)
            .AsQueryable();

        query = query.Where(x => x.Id != dataParams.CurrentUserId);

        if (!string.IsNullOrEmpty(dataParams.Username))
        {
            query = query.Where(x => x.UserName!.ToUpper().Contains(dataParams.Username.ToUpper()));
        }

        return await PagedList<User>.CreateAsync(query, dataParams.PageNumber, dataParams.PageSize);
    }

    public void RemoveUser(User user)
    {
        context.Users.Remove(user);
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public void Update(User user)
    {
        context.Entry(user).State = EntityState.Modified;
    }
}