using API.DTOs;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController(IUnitOfWork unitOfWork) : BaseApiController
{
    [HttpPost("{targetTravelId:int}")]
    [Authorize]
    public async Task<ActionResult> ToggleLikeTravel(int targetTravelId)
    {
        var user = await unitOfWork.UserRepository.GetUserByIdAsync(User.GetUserId());
        if (user == null)
        {
            throw new Exception("no user found based on id from claims.");
        }
        var sourceUserId = user.Id;
        var travel = await unitOfWork.TravelRepository.GetTravelDetailAsync(targetTravelId);
        if (travel == null) return NotFound("Travel not found.");

        var existingLike = await unitOfWork.LikesRepository.GetTravelLikeByUser(targetTravelId, sourceUserId);

        if (existingLike == null)
        {
            var like = new TravelLike
            {
                UserId = sourceUserId,
                TravelId = targetTravelId
            };
            unitOfWork.LikesRepository.AddLike(like);
        }
        else
        {
            unitOfWork.LikesRepository.DeleteLike(existingLike);
        }

        if (await unitOfWork.Complete())
        {
            return Ok(new { message = "You have unliked this travel post." });
        }
        return BadRequest("Failed to like/unlike travel post.");
    }

    [HttpGet("{travelId:int}/likedbyuser")]
    public async Task<ActionResult<bool>> IsTravelLikedByUser(int travelId)
    {
        var user = await unitOfWork.UserRepository.GetUserByIdAsync(User.GetUserId());
        if (user == null)
        {
            throw new Exception("no user found based on id from claims.");
        }
        var userId = user.Id;
        var existingLike = await unitOfWork.LikesRepository.GetTravelLikeByUser(travelId, userId);

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
    public async Task<ActionResult<int>> GetLikeCountForTravel(int travelId)
    {
        var likeCount = await unitOfWork.LikesRepository.CountLikesForTravel(travelId);
        return likeCount;
    }

    [HttpGet("{travelId:int}/userswholiked")]
    public async Task<IEnumerable<MemberDto>> GetUsersWhoLikedTravel(int travelId)
    {
        var usersWhoLiked = await unitOfWork.LikesRepository.GetUsersWhoLikedTravel(travelId);
        return usersWhoLiked;

    }
}