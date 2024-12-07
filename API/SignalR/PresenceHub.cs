using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize]
public class PresenceHub(PresenceTracker tracker) : Hub
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
}
