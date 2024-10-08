using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TravelController(IMapper mapper, ITravelRepository repository) : BaseApiController
    {
        [HttpGet("{id}")]
        public async Task<ActionResult<List<TravelDto>>> GetTravelsById(int id)
        {
            var travels = await repository.GetTravelsAsync(id);

            return mapper.Map<List<TravelDto>>(travels);
        }
    }
}