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
                .Include(t => t.TravelPlaces)
                .ThenInclude(tp => tp.Place)
                .SingleOrDefaultAsync(t => t.Id == travelId);
        }

        async Task<IEnumerable<Travel>> ITravelRepository.GetTravelsAsync(int userId)
        {
            return await context.Travels
                .Where(t => t.UserId == userId)
                .Include(t => t.Photos)
                .Include(t => t.TravelPlaces)
                .ThenInclude(tp => tp.Place)
                .ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }

    }
}