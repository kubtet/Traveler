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
public class UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService) : BaseApiController
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<MemberDto>>> GetUsers([FromQuery] DataParams dataParams)
    {
        var users = await userRepository.GetUsersAsync(dataParams);
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

    [AllowAnonymous] //TODO
    [HttpGet("{id}")]
    public async Task<ActionResult<MemberDto>> GetUserById(int id)
    {
        var user = await userRepository.GetUserByIdAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return mapper.Map<MemberDto>(user);
    }

    [AllowAnonymous]
    [HttpGet("username/{username}")]
    public async Task<ActionResult<MemberDto>> GetUserByUsername(string username)
    {
        var user = await userRepository.GetUserByUsernameAsync(username);

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

            var user = await userRepository.GetUserByIdAsync(userId);
            Console.WriteLine(user);
            Console.WriteLine(userId);

            if (user == null) return BadRequest("Could not find a user");
            mapper.Map(updateUserDto, user);
            if (await userRepository.SaveAllAsync())
            {
                // tokenService.CreateToken(user);
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
        var user = await userRepository.GetUserByIdAsync(User.GetUserId());
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

        if (await userRepository.SaveAllAsync()) return Ok(mapper.Map<PhotoDto>(photo));

        return BadRequest("Not able to modify profile picture.");
    }

    [HttpDelete("delete-profile-photo")]
    public async Task<ActionResult> DeleteProfilePhoto()
    {
        var user = await userRepository.GetUserByIdAsync(User.GetUserId());
        if (user == null) return BadRequest("No user found in token.");
        if (user.ProfilePhoto?.Url == null) return BadRequest("No profile picture exist.");
        if (user.ProfilePhoto?.PublicId == null) return BadRequest("No profile picture public id.");

        var result = await photoService.DeletePhotoAsync(user.ProfilePhoto.PublicId);
        if (result.Error != null) return BadRequest(result.Error.Message);
        user.ProfilePhoto = null;

        if (await userRepository.SaveAllAsync())
        {
            return Ok("Profile picture deleted.");
        }
        return BadRequest("Not able to delete profile picture.");
    }
}