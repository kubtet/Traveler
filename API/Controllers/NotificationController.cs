using API.DTOs;
using API.Entities;
using API.Enums;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class NotificationController(IUnitOfWork unitOfWork, IMapper mapper,
    UserManager<User> userManager) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult> AddNotification(AddNotificationDto addNotificationDto)
    {
        var currentUserId = User.GetUserId();
        var currentUser = await userManager.Users.FirstOrDefaultAsync(u => u.Id == currentUserId);

        string content = "";

        if (addNotificationDto.NotificationType == TypeOfNotification.Followed)
        {
            content = $"{currentUser?.UserName} has followed you.";
        }
        else
        {
            content = $"{currentUser?.UserName} has liked your travel {addNotificationDto?.TravelTitle}.";
        }

        var notification = new Notification
        {
            Content = content,
            NotifiedUserId = addNotificationDto!.NotifiedUserId,
            NotifierId = currentUserId,
            Notifier = currentUser!,
        };

        unitOfWork.NotificationRepository.AddNotification(notification);

        if (await unitOfWork.Complete())
        {
            return Ok("Notification added correctly");
        }

        return BadRequest("There was an error adding a notification");
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<NotificationDto>>> GetNotificationsForUser([FromQuery] NotificationParams notificationParams)
    {
        notificationParams.UserId = User.GetUserId();

        var notifications = await unitOfWork.NotificationRepository.GetNotificationsForUser(notificationParams);

        if (unitOfWork.HasChanges()) await unitOfWork.Complete();

        var notificationDtos = notifications.Select(mapper.Map<NotificationDto>).ToList();

        var response = new PaginatedResponse<NotificationDto>(
            notificationDtos,
            notifications.CurrentPage,
            notifications.TotalPages,
            notifications.PageSize,
            notifications.TotalCount
        );

        return Ok(response);
    }

    [HttpGet("numberOfUnread")]
    public async Task<ActionResult<int>> GetUnreadNotificationsCount()
    {
        var currentUserId = User.GetUserId();

        return Ok(await unitOfWork.NotificationRepository.GetNumberOfUnreadNotifications(currentUserId));
    }

    [HttpDelete("remove/{notificationId}")]
    public async Task<ActionResult> DeleteNotification(int notificationId)
    {
        var notification = await unitOfWork.NotificationRepository.GetNotification(notificationId);

        if (notification == null)
        {
            return BadRequest("Notification with provided id was not found");
        }

        unitOfWork.NotificationRepository.RemoveNotification(notification);

        if (await unitOfWork.Complete())
        {
            return Ok("Notification removed correctly");
        }

        return BadRequest("There was an error removing notification");
    }
}
