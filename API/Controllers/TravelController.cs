using System.Diagnostics;
using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TravelController(IMapper mapper, ITravelRepository repository) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<TravelDto>>> GetAllTravels()
        {
            var travels = await repository.GetAllTravelsAsync();

            return mapper.Map<List<TravelDto>>(travels);
        }

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

        [HttpPost("create")]
        public async Task<ActionResult> CreateTravel(CreateTravelDto createTravelDto)
        {
            if (createTravelDto == null)
            {
                return BadRequest("No input provided");
            }

            var travel = mapper.Map<Entities.Travel>(createTravelDto);

            repository.CreateTravel(travel);
            if (await repository.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Failed to add a travel");
        }

        [HttpDelete("remove/{id}")]
        public async Task<ActionResult> RemoveTravel(int id)
        {
            var travel = await repository.GetTravelDetailAsync(id);

            if (travel == null)
            {
                return BadRequest("No travel with provided id found");
            }

            repository.RemoveTravel(travel);

            if (await repository.SaveAllAsync())
            {
                return NoContent();
            }
            return BadRequest("Failed to remove a travel");
        }
    }
}