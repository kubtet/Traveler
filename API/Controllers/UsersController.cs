using System.Security.Claims;
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
public class UsersController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<MemberDto>>> GetUsers([FromQuery] DataParams dataParams)
    {
        dataParams.CurrentUserId = User.GetUserId();
        var users = await unitOfWork.UserRepository.GetUsersAsync(dataParams);
        var usersToReturn = users.Select(mapper.Map<MemberDto>).ToList();
        var response = new PaginatedResponse<MemberDto>(
                usersToReturn,
                users.CurrentPage,
                users.TotalPages,
                users.PageSize,
                users.TotalCount
            );

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MemberDto>> GetUserById(int id)
    {
        var user = await unitOfWork.UserRepository.GetUserByIdAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return mapper.Map<MemberDto>(user);
    }

    [HttpGet("username/{username}")]
    public async Task<ActionResult<MemberDto>> GetUserByUsername(string username)
    {
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);

        if (user == null)
        {
            return NotFound();
        }

        return mapper.Map<MemberDto>(user);
    }


    [HttpPut("update")]
    public async Task<ActionResult> UpdateUser(UpdateUserDto updateUserDto)
    {
        var idUserString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (idUserString == null) return BadRequest("No id found in token.");

        if (int.TryParse(idUserString, out int userId))
        {
            Console.WriteLine($"User ID: {userId}");

            var user = await unitOfWork.UserRepository.GetUserByIdAsync(userId);
            Console.WriteLine(user);
            Console.WriteLine(userId);

            if (user == null) return BadRequest("Could not find a user");
            mapper.Map(updateUserDto, user);
            user.NormalizedUserName = user.UserName?.ToUpper();
            if (await unitOfWork.Complete())
            {
                return NoContent();
            }
        }
        else
        {
            Console.WriteLine("Cannot convert NameIdentifier to Int.");
        }


        return BadRequest("Failed to save changes.");
    }

    [HttpPut("modify-profile-photo")]
    public async Task<ActionResult<PhotoDto>> ModifyProfilePicture(IFormFile file)
    {
        var user = await unitOfWork.UserRepository.GetUserByIdAsync(User.GetUserId());
        if (user == null) return BadRequest("Cannot update user");

        var result = await photoService.AddPhotoAsync(file, TypeOfPhoto.Profile);

        if (result.Error != null) return BadRequest(result.Error.Message);

        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId,
            UserId = user.Id,
            IsProfilePicture = true
        };

        user.ProfilePhoto = photo;

        if (await unitOfWork.Complete()) return Ok(mapper.Map<PhotoDto>(photo));

        return BadRequest("Not able to modify profile picture.");
    }

    [HttpDelete("delete-profile-photo")]
    public async Task<ActionResult> DeleteProfilePhoto()
    {
        var user = await unitOfWork.UserRepository.GetUserByIdAsync(User.GetUserId());
        if (user == null) return BadRequest("No user found in token.");
        if (user.ProfilePhoto?.Url == null) return BadRequest("No profile picture exist.");
        if (user.ProfilePhoto?.PublicId == null) return BadRequest("No profile picture public id.");

        var result = await photoService.DeletePhotoAsync(user.ProfilePhoto.PublicId);
        if (result.Error != null) return BadRequest(result.Error.Message);
        user.ProfilePhoto = null;

        if (await unitOfWork.Complete())
        {
            return Ok("Profile picture deleted.");
        }
        return BadRequest("Not able to delete profile picture.");
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUser(int id)
    {
        var user = await unitOfWork.UserRepository.GetUserByIdWithTravelsAndPhotosAsync(id);

        if (user == null)
        {
            return BadRequest("The user with provided id doesn't exist");
        }

        if (user.ProfilePhoto != null)
        {
            if (user.ProfilePhoto?.PublicId == null) return BadRequest("No profile picture public id.");
            var result = await photoService.DeletePhotoAsync(user.ProfilePhoto.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);
        }

        if (user.Travels != null && user.Travels.Count > 0)
        {
            foreach (var travel in user.Travels)
            {
                if (travel.Photos != null && travel.Photos.Count > 0)
                {
                    foreach (var photo in travel.Photos)
                    {
                        if (photo?.PublicId == null)
                        {
                            return BadRequest("No photo public id.");
                        }

                        var result = await photoService.DeletePhotoAsync(photo.PublicId);
                        if (result.Error != null)
                        {
                            return BadRequest(result.Error.Message);
                        }
                    }
                }
            }
        }

        unitOfWork.UserRepository.RemoveUser(user);

        if (await unitOfWork.Complete())
        {
            return Ok("User removed correctly");
        }
        return BadRequest("Not able to delete a user.");
    }
}