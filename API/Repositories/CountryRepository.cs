using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class CountryRepository(DataContext context) : ICountryRepository
    {
        public async Task<IEnumerable<Country>> GetAllCountriesAsync()
        {
            return await context.Countries.ToListAsync();
        }
    }
}