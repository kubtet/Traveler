
using System.Diagnostics.Tracing;
using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using API.Services;
using AutoMapper;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class UsersController(IUserRepository userRepository, IMapper mapper, ITokenService tokenService, IPhotoService photoService) : BaseApiController
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        var users = await userRepository.GetUsersAsync();
        var usersToReturn = mapper.Map<IEnumerable<MemberDto>>(users);
        return Ok(usersToReturn);
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
        ;
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
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (username == null) return BadRequest("No username found in token.");
        var user = await userRepository.GetUserByUsernameAsync(username);
        if (user == null) return BadRequest("Could not find a user");
        mapper.Map(updateUserDto, user);

        if (await userRepository.SaveAllAsync())
        {
            tokenService.CreateToken(user);
            return NoContent();
        }


        return BadRequest("Failed to save changes.");
    }

    [HttpPut("modify-profile-photo")]
    public async Task<ActionResult<PhotoDto>> ModifyProfilePicture(IFormFile file)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Cannot update user");

        var result = await photoService.AddPhotoAsync(file);

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
        // get current user
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("No user found in token.");
        if (user.ProfilePhoto.Url == null) return BadRequest("No profile picture exist.");

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