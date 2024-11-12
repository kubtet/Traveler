using API.DTOs;
using API.Entities;
using API.Enums;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TravelController(IMapper mapper, ITravelRepository repository, IPhotoService photoService) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<PaginatedResponse<TravelDto>>> GetAllTravels([FromQuery] DataParams dataParams)
        {
            var travels = await repository.GetAllTravelsAsync(dataParams);

            var travelDtos = travels.Select(mapper.Map<TravelDto>).ToList();

            var response = new PaginatedResponse<TravelDto>(
                travelDtos,
                travels.CurrentPage,
                travels.TotalPages,
                travels.PageSize,
                travels.TotalCount
            );

            return Ok(response);
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
        public async Task<ActionResult<int>> CreateTravel(CreateTravelDto createTravelDto)
        {
            if (createTravelDto == null)
            {
                return BadRequest("No input provided");
            }

            var travel = mapper.Map<Travel>(createTravelDto);

            repository.CreateTravel(travel);
            if (await repository.SaveAllAsync())
            {
                return Ok(travel.Id);
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

        [Consumes("multipart/form-data")]
        [HttpPost("user/add-travel-photo/{id}")]
        public async Task<ActionResult> AddTravelPhoto([FromForm] IFormFile[] images, int id)
        {
            var travel = await repository.GetTravelDetailAsync(id);
            if (travel == null)
            {
                return BadRequest("No travel found.");
            }

            foreach (var image in images)
            {
                var result = await photoService.AddPhotoAsync(image, TypeOfPhoto.Travel);
                if (result.Error != null)
                {
                    return BadRequest(result.Error.Message);
                }

                var photo = new Photo
                {
                    Url = result.SecureUrl.AbsoluteUri,
                    PublicId = result.PublicId
                };

                travel.Photos.Add(photo);
            }

            if (await repository.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Error adding photo to the travel...");
        }
    }
}