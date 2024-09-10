using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API;

public class UserRepository(DataContext context) : IUserRepository
{
    public async Task<User?> GetUserByIdAsync(int id)
    {
        return await context.Users
        .FindAsync(id);
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await context.Users
          .Include(x => x.Travels)
        //  .Include(x => x.Followers)
        //   .Include(x => x.Following)
        .SingleOrDefaultAsync(x => x.UserName == username);
    }

    public async Task<IEnumerable<User>> GetUsersAsync()
    {
        return await context.Users
        .Include(x => x.Travels)
        //  .Include(x => x.Followers)
        //   .Include(x => x.Following)
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