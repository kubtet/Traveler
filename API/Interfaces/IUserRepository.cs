using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IUserRepository
{
    void Update(User user);
    Task<bool> SaveAllAsync();
    Task<PagedList<User>> GetUsersAsync(DataParams dataParams);
    Task<User?> GetUserByIdAsync(int id);
    Task<User?> GetUserByUsernameAsync(string username); // returning Task -> method ended with Async, then using this we know that we need to await response
}
