
using System.Data;
using API;
using API.Controllers;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;

public class FollowsController(IFollowsRepository followsRepository) : BaseApiController
{
    [HttpPost("{targetUserId:int}")]
    public async Task<ActionResult> ToggleLike(int targetUserId)
    {
        var sourceUserId = User.GetUserId();

        if (sourceUserId == targetUserId) return BadRequest("You cannot follow yourself!");

        var existingFollow = await followsRepository.GetFollow(sourceUserId, targetUserId);

        if (existingFollow == null)
        {
            var follow = new Follow
            {
                SourceUserId = sourceUserId,
                FollowedUserId = targetUserId,
                CreatedAt = DateTime.UtcNow,
            };

            followsRepository.AddFollow(follow);
        }
        else
        {
            followsRepository.DeleteFollow(existingFollow);
        }

        if (await followsRepository.SaveChangesAsync())
        {
            return Ok();
        }
        return BadRequest("Failed to follow/unfollow user.");
    }

    [HttpGet("{userId:int}/followers")]
    public async Task<ActionResult> GetFollowers(int userId)
    {
        var followers = await followsRepository.GetFollowers(userId);
        return Ok(followers);
    }

    [HttpGet("{userId:int}/following")]
    public async Task<ActionResult> GetFollowing(int userId)
    {
        var followings = await followsRepository.GetFollowings(userId);
        return Ok(followings);
    }


    [HttpGet("{userId:int}/following/count")]
    public async Task<ActionResult> CountFollowings(int userId)
    {
        var count = await followsRepository.CountFollowings(userId);
        return Ok(new { userId, count });
    }

    [HttpGet("{userId:int}/followers/count")]
    public async Task<ActionResult> CountFollowers(int userId)
    {
        var count = await followsRepository.CountFollowers(userId);
        return Ok(new { userId, count });
    }
}