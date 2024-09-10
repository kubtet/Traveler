using API.Entities;

namespace API;

public interface IUserRepository
{
    void Update(User user);
    Task<bool> SaveAllAsync();
    Task<IEnumerable<User>> GetUsersAsync();
    Task<User?> GetUserByIdAsync(int id);
    Task<User?> GetUserByUsernameAsync(string username); // returning Task -> method ended with Async, then using this we know that we need to await response
}
