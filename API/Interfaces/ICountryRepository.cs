using API.Entities;

namespace API.Interfaces
{
    public interface ICountryRepository
    {
        Task<IEnumerable<Country>> GetAllCountriesAsync();
        Task<IEnumerable<string>> GetAllVisitedCountriesCodes(int userId);
    }
}