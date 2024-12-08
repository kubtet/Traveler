using API.DTOs;
using API.Entities;
using API.Enums;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace API.SignalR;

[Authorize]
public class PresenceHub(INotificationRepository notificationRepository, PresenceTracker tracker,
    UserManager<User> userManager) : Hub
{
    public override async Task OnConnectedAsync()
    {
        if (Context.User == null) throw new HubException("Cannot get current user claim");

        var isOnline = await tracker.UserConnected(Context.User.GetUserId(), Context.ConnectionId);
        if (isOnline)
        {
            await Clients.Others.SendAsync("UserIsOnline", Context.User?.GetUserId());
        }

        var onlineUsersIds = tracker.GetOnlineUsersIds();
        await Clients.Caller.SendAsync("GetOnlineUsersIds", onlineUsersIds);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (Context.User == null) throw new HubException("Cannot get current user claim");

        var isOffline = await tracker.UserDisconnected(Context.User.GetUserId(), Context.ConnectionId);
        if (isOffline)
        {
            await Clients.Others.SendAsync("UserIsOffline", Context.User?.GetUserId());
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task AddNotification(AddNotificationDto addNotificationDto)
    {
        if (Context.User == null) throw new HubException("Cannot get current user claim");

        var currentUserId = Context.User.GetUserId();
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

        notificationRepository.AddNotification(notification);

        if (await notificationRepository.SaveAllAsync())
        {
            var connections = await PresenceTracker.GetConnectionsForUser(addNotificationDto.NotifiedUserId);
            if (connections != null && connections?.Count != null)
            {
                await Clients.Clients(connections).SendAsync("NewNotificationReceived", notification);
            }
        }
    }
}
