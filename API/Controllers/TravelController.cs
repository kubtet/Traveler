using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TravelController(IMapper mapper, ITravelRepository repository) : BaseApiController
    {
        [HttpGet("user/{id}")]
        public async Task<ActionResult<List<TravelDto>>> GetTravelsByUserId(int id)
        {
            var travels = await repository.GetTravelsAsync(id);

            return mapper.Map<List<TravelDto>>(travels);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TravelDetailDto>> GetTravelDetails(int id)
        {
            var travel = await repository.GetTravelDetailAsync(id);

            return mapper.Map<TravelDetailDto>(travel);
        }
    }
}