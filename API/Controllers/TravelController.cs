using API.DTOs;
using API.Entities;
using API.Enums;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class TravelController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<TravelDto>>> GetAllTravels([FromQuery] DataParams dataParams)
    {
        dataParams.CurrentUserId = User.GetUserId();
        var travels = await unitOfWork.TravelRepository.GetAllTravelsAsync(dataParams);

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
    public async Task<ActionResult<PaginatedResponse<TravelDto>>> GetTravelsByUserId(int id, [FromQuery] DataParams dataParams)
    {
        dataParams.UserId = id;
        var travels = await unitOfWork.TravelRepository.GetTravelsAsync(dataParams);

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

    [HttpGet("{id}")]
    public async Task<ActionResult<TravelDetailDto>> GetTravelDetails(int id)
    {
        var travel = await unitOfWork.TravelRepository.GetTravelDetailAsync(id);

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

        unitOfWork.TravelRepository.CreateTravel(travel);
        if (await unitOfWork.Complete())
        {
            return Ok(travel.Id);
        }

        return BadRequest("Failed to add a travel");
    }

    [HttpDelete("remove/{id}")]
    public async Task<ActionResult> RemoveTravel(int id)
    {
        var travel = await unitOfWork.TravelRepository.GetTravelDetailAsync(id);

        if (travel == null)
        {
            return BadRequest("No travel with provided id found");
        }

        if (travel.Photos != null && travel.Photos.Count > 0)
        {
            foreach (var photo in travel.Photos)
            {
                if (photo?.PublicId == null)
                {
                    return BadRequest("No photo public id.");
                }

                if (photo?.PublicId != "Seed")
                {
                    var result = await photoService.DeletePhotoAsync(photo!.PublicId);
                    if (result.Error != null)
                    {
                        return BadRequest(result.Error.Message);
                    }
                }
            }
        }

        unitOfWork.TravelRepository.RemoveTravel(travel);

        if (await unitOfWork.Complete())
        {
            return NoContent();
        }
        return BadRequest("Failed to remove a travel");
    }

    [Consumes("multipart/form-data")]
    [HttpPost("user/add-travel-photo/{id}")]
    public async Task<ActionResult> AddTravelPhoto([FromForm] IFormFile[] images, int id)
    {
        var travel = await unitOfWork.TravelRepository.GetTravelDetailAsync(id);
        if (travel == null)
        {
            return BadRequest("No travel found.");
        }

        var uploadTasks = images.Select(async image =>
        {
            var result = await photoService.AddPhotoAsync(image, TypeOfPhoto.Travel);
            if (result.Error != null)
            {
                throw new Exception(result.Error.Message);
            }

            return new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };
        });

        try
        {
            var photos = await Task.WhenAll(uploadTasks);
            foreach (var photo in photos)
            {
                travel.Photos.Add(photo);
            }

            if (await unitOfWork.Complete())
            {
                return NoContent();
            }
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }

        return BadRequest("Error adding photo to the travel...");
    }
}
