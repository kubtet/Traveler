using API.Data;
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

            return mapper.Map<MemberDto>(user);;
        }
    }
}