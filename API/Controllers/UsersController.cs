using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController(IUserRepository userRepository, IMapper mapper) : BaseApiController
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

            return mapper.Map<MemberDto>(user); ;
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(UpdateUserDto updateUserDto, IMapper mapper)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (username == null) return BadRequest("No username found in token.");
            var user = await userRepository.GetUserByUsernameAsync(username);
            if (user == null) return BadRequest("Could not find a user");
            mapper.Map(updateUserDto, user);
            if (await userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to save changes.");
        }
    }
}