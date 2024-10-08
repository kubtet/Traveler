using API.Entities;

namespace API.Interfaces
{
    public interface ITravelRepository
    {
        Task<IEnumerable<Travel>> GetTravelsAsync(int userId);
    }
}