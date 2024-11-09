using API.DTOs;

namespace API;
public interface ILikesRepository
{

    Task<TravelLike?> GetTravelLike(int TravelId, int UserId); // checks if user like travel
    Task<IEnumerable<int>> GetCurrentTravelLikeIds(int currentTravelId);


    void DeleteLike(TravelLike follow);
    void AddLike(TravelLike follow);
    Task<bool> SaveChanges();

}