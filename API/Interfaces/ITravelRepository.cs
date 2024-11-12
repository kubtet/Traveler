using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface ITravelRepository
    {
        void CreateTravel(Travel travel);
        Task<PagedList<Travel>> GetAllTravelsAsync(DataParams dataParams);
        Task<IEnumerable<Travel>> GetTravelsAsync(int userId);
        Task<Travel?> GetTravelDetailAsync(int travelId);
        Task<bool> SaveAllAsync();
        void RemoveTravel(Travel travel);
    }
}