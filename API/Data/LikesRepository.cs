
using API;
using API.Data;

public class LikesRepository(DataContext context) : ILikesRepository
{
    public void AddLike(TravelLike like)
    {
        context.TravelLikes.Add(like);
    }

    public void DeleteLike(TravelLike like)
    {
        context.TravelLikes.Remove(like);

    }

    public Task<IEnumerable<int>> GetCurrentTravelLikeIds(int currentTravelId)
    {
        throw new NotImplementedException();
    }

    public Task<TravelLike?> GetTravelLike(int TravelId, int UserId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> SaveChanges()
    {
        throw new NotImplementedException();
    }
}