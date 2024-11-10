
using API;
using API.Controllers;
using API.Data;
using API.DTOs;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;

public class LikesController(DataContext context, ILikesRepository likesRepository) : BaseApiController
{
    [HttpPost("{targetTravelId:int}")]
    public async Task<ActionResult> ToggleLikeTravel(int targetTravelId)
    {
        var sourceUserId = User.GetUserId();
        var travel = await context.Travels.FindAsync(targetTravelId);
        if (travel == null) return NotFound("Travel not found.");

        var existingLike = await likesRepository.GetTravelLikeByUser(targetTravelId, sourceUserId);

        if (existingLike == null)
        {
            var like = new TravelLike
            {
                UserId = sourceUserId,
                TravelId = targetTravelId
            };
            likesRepository.AddLike(like);
        }
        else
        {
            likesRepository.DeleteLike(existingLike);
        }

        if (await likesRepository.SaveChanges())
        {
            return Ok(new { message = "You have unliked this travel post." });
        }


        return BadRequest("Failed to like/unlike travel post.");

    }

    [HttpGet("{travelId:int}/likedbyuser")]
    public async Task<bool> IsTravelLikedByUser(int travelId)
    {
        var userId = User.GetUserId();
        var existingLike = await likesRepository.GetTravelLikeByUser(travelId, userId);

        if (existingLike != null)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    [HttpGet("{travelId:int}/likecount")]
    public async Task<int> GetLikeCountForTravel(int travelId)
    {
        var likeCount = await likesRepository.CountLikesForTravel(travelId);
        return likeCount;
    }

    [HttpGet("{travelId:int}/userswholiked")]
    public async Task<IEnumerable<MemberDto>> GetUsersWhoLikedTravel(int travelId)
    {
        var usersWhoLiked = await likesRepository.GetUsersWhoLikedTravel(travelId);
        return usersWhoLiked;

    }




}