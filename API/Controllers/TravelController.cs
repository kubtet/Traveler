using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TravelController(IMapper mapper, ITravelRepository repository, IPhotoService photoService) : BaseApiController
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


        [HttpPost("user/add-travel-photo/{id}")]
        public async Task<ActionResult<PhotoDto>> AddTravelPhoto(IFormFile file, int id)
        {
            var travel = await repository.GetTravelDetailAsync(id);
            if(travel == null) return BadRequest("No travel found.");
            var result = await photoService.AddPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            travel.Photos.Add(photo);
            if (await repository.SaveAllAsync()) return mapper.Map<PhotoDto>(photo);

            return BadRequest("Error adding photo to the travel...");




        }


    }
}