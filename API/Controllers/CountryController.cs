using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CountryController(ICountryRepository repository) : BaseApiController
    {
        [HttpGet("countries")]
        public async Task<ActionResult<List<Country>>> GetAllCountries()
        {
            var countries = await repository.GetAllCountriesAsync();

            return Ok(countries);
        }
    }
}