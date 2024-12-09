using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface ITravelRepository
    {
        void CreateTravel(Travel travel);
        Task<PagedList<Travel>> GetAllTravelsAsync(DataParams dataParams);
        Task<PagedList<Travel>> GetTravelsAsync(DataParams dataParams);
        Task<List<Travel>> GetTravelsAsyncByUserId(int userId);
        Task<Travel?> GetTravelDetailAsync(int travelId);
        void RemoveTravel(Travel travel);
    }
}