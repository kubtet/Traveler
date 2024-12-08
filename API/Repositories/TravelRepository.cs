using API.Data;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class TravelRepository(DataContext context) : ITravelRepository
    {
        public async Task<Travel?> GetTravelDetailAsync(int travelId)
        {
            return await context.Travels
                .Include(t => t.User)
                .Include(t => t.Photos)
                .SingleOrDefaultAsync(t => t.Id == travelId);
        }

        async Task<PagedList<Travel>> ITravelRepository.GetTravelsAsync(DataParams dataParams)
        {
            var query = context.Travels
                .Where(t => t.UserId == dataParams.UserId)
                .Include(t => t.Photos)
                .AsQueryable();

            query = query.OrderByDescending(t => t.StartDate);

            return await PagedList<Travel>.CreateAsync(query, dataParams.PageNumber, dataParams.PageSize);
        }

        async Task<PagedList<Travel>> ITravelRepository.GetAllTravelsAsync(DataParams dataParams)
        {
            var query = context.Travels.Include(t => t.Photos).AsQueryable();
            query = query.Where(t => t.UserId != dataParams.CurrentUserId);

            query = query.OrderByDescending(t => t.CreatedAt);

            return await PagedList<Travel>.CreateAsync(query, dataParams.PageNumber, dataParams.PageSize);
        }

        async void ITravelRepository.CreateTravel(Travel travel)
        {
            await context.Travels.AddAsync(travel);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public void RemoveTravel(Travel travel)
        {
            context.Travels.Remove(travel);
        }

        async public Task<List<Travel>> GetTravelsAsyncByUserId(int userId)
        {
            var query = context.Travels.Include(t => t.Photos).AsQueryable();
            query = query.Where(t => t.UserId == userId);

            query = query.OrderByDescending(t => t.CreatedAt);

            return await query.ToListAsync();
        }
    }
}