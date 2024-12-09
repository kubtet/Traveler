using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class FollowsController(IUnitOfWork unitOfWork) : BaseApiController
{
    [HttpPost("{targetUserId:int}")]
    public async Task<ActionResult> ToggleFollow(int targetUserId)
    {
        var sourceUserId = User.GetUserId();

        if (sourceUserId == targetUserId) return BadRequest("You cannot follow yourself!");

        var existingFollow = await unitOfWork.FollowsRepository.GetFollow(sourceUserId, targetUserId);

        if (existingFollow == null)
        {
            var follow = new Follow
            {
                SourceUserId = sourceUserId,
                FollowedUserId = targetUserId,
                CreatedAt = DateTime.UtcNow,
            };

            unitOfWork.FollowsRepository.AddFollow(follow);
        }
        else
        {
            unitOfWork.FollowsRepository.DeleteFollow(existingFollow);
        }

        if (await unitOfWork.Complete())
        {
            return Ok("Followed/unfollowed a user.");
        }
        return BadRequest("Failed to follow/unfollow user.");
    }

    [HttpGet("{userId:int}/followers")]
    public async Task<IEnumerable<MemberDto>> GetFollowers(int userId)
    {
        var followers = await unitOfWork.FollowsRepository.GetFollowers(userId);
        return followers;
    }

    [HttpGet("{userId:int}/following")]
    public async Task<IEnumerable<MemberDto>> GetFollowing(int userId)
    {
        var followings = await unitOfWork.FollowsRepository.GetFollowings(userId);
        return followings;
    }


    [HttpGet("{userId:int}/following/count")]
    public async Task<ActionResult<int>> CountFollowings(int userId)
    {
        var count = await unitOfWork.FollowsRepository.CountFollowings(userId);
        return Ok(count);
    }

    [HttpGet("{userId:int}/followers/count")]
    public async Task<ActionResult<int>> CountFollowers(int userId)
    {
        var count = await unitOfWork.FollowsRepository.CountFollowers(userId);
        return Ok(count);
    }

    [HttpGet("{targetUserId:int}/followedBy")]
    public async Task<ActionResult<bool>> IsFollowedByCurrentStatus(int targetUserId)
    {
        var user = await unitOfWork.UserRepository.GetUserByIdAsync(User.GetUserId());
        if (user == null)
        {
            throw new Exception("no user found based on id from claims.");
        }
        var userId = user.Id;
        var existingFollow = await unitOfWork.FollowsRepository.GetFollow(userId, targetUserId);

        if (existingFollow != null)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

}