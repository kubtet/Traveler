using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class CountryRepository(DataContext context) : ICountryRepository
{
    public async Task<IEnumerable<Country>> GetAllCountriesAsync()
    {
        return await context.Countries.ToListAsync();
    }

    public async Task<IEnumerable<string>> GetAllVisitedCountriesCodes(int userId)
    {
        var countryCodes = await context.Travels
            .Where(t => t.UserId == userId)
            .Select(t => t.CountryIso2Code)
            .Distinct()
            .ToListAsync();

        return countryCodes;
    }
}
