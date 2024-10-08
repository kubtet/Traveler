using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class UserRepository(DataContext context) : IUserRepository
{
    public async Task<User?> GetUserByIdAsync(int id)
    {
        return await context.Users.FindAsync(id);
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await context.Users
            .Include(x => x.Travels)
            //.Include(x => x.Followers)
            //.Include(x => x.Following)
            .SingleOrDefaultAsync(x => x.UserName == username);
    }

    public async Task<IEnumerable<User>> GetUsersAsync()
    {
        return await context.Users
            .Include(u => u.Followers)
            .ThenInclude(f => f.FollowingUser)
            .Include(u => u.Following)
            .ThenInclude(f => f.FollowedUser)
            .Include(u => u.Travels)
            .ThenInclude(t => t.Photos)
            .Include(u => u.Travels)
            .ThenInclude(t => t.TravelPlaces)
            .ThenInclude(tp => tp.Place)
            .ToListAsync();
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