using API.Data;
using API.Entities;
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

        async Task<IEnumerable<Travel>> ITravelRepository.GetTravelsAsync(int userId)
        {
            return await context.Travels
                .Where(t => t.UserId == userId)
                .Include(t => t.Photos)
                .ToListAsync();
        }

        async Task<IEnumerable<Travel>> ITravelRepository.GetAllTravelsAsync()
        {
            return await context.Travels.ToListAsync();
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
    }
}