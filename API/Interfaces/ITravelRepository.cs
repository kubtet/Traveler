using API.Entities;

namespace API.Interfaces
{
    public interface ITravelRepository
    {
        void CreateTravel(Travel travel);
        Task<IEnumerable<Travel>> GetAllTravelsAsync();
        Task<IEnumerable<Travel>> GetTravelsAsync(int userId);
        Task<Travel?> GetTravelDetailAsync(int travelId);
        Task<bool> SaveAllAsync();
        void RemoveTravel(Travel travel);
    }
}