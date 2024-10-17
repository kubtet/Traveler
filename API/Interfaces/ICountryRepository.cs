using API.Entities;

namespace API.Interfaces
{
    public interface ICountryRepository
    {
        Task<IEnumerable<Country>> GetAllCountriesAsync();
    }
}