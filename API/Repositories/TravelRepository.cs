using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class TravelRepository(DataContext context) : ITravelRepository
    {
        async Task<IEnumerable<Travel>> ITravelRepository.GetTravelsAsync(int userId)
        {
            return await context.Travels
                .Where(t => t.UserId == userId)
                .Include(t => t.Photos)
                .Include(t => t.TravelPlaces)
                .ThenInclude(tp => tp.Place)
                .ToListAsync();
        }
    }
}