using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize]
public class MessageHub(IUnitOfWork unitOfWork,
    IMapper mapper, IHubContext<PresenceHub> presenceHub) : Hub
{
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var otherUserIdString = httpContext?.Request.Query["user"];

        if (string.IsNullOrEmpty(otherUserIdString) ||
            !int.TryParse(otherUserIdString, out int otherUserId) ||
            otherUserId <= 0 ||
            Context.User?.GetUserId() <= 0 ||
            Context.User?.GetUserId() == null)
        {
            throw new Exception("Cannot join group");
        }

        var groupName = GetGroupName(Context.User.GetUserId(), otherUserId);
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        var group = await AddToGroup(groupName);

        await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

        var messages = await unitOfWork.MessageRepository.GetMessageThread(Context.User.GetUserId(), otherUserId);

        if (unitOfWork.HasChanges()) await unitOfWork.Complete();
        await Clients.Caller.SendAsync("ReceiveMessageThread", mapper.Map<MessageDto[]>(messages));
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var group = await RemoveFromMessageGroup();
        await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(CreateMessageDto createMessageDto)
    {
        var userId = Context.User?.GetUserId() ?? throw new Exception("Could not get user");

        if (userId == createMessageDto.RecipientId)
        {
            throw new HubException("You cannot message yourself");
        }

        var sender = await unitOfWork.UserRepository.GetUserByIdAsync(userId);
        var recipient = await unitOfWork.UserRepository.GetUserByIdAsync(createMessageDto.RecipientId);

        if (sender == null || recipient == null || sender.UserName == null || recipient.UserName == null)
        {
            throw new HubException("Cannot send message at this time");
        }

        var message = new Message
        {
            Sender = sender,
            Recipient = recipient,
            SenderUsername = sender.UserName,
            RecipientUsername = recipient.UserName,
            Content = createMessageDto.Content
        };

        var groupName = GetGroupName(sender.Id, recipient.Id);
        var group = await unitOfWork.MessageRepository.GetMessageGroup(groupName);

        if (group != null && group.Connections.Any(x => x.UserId == recipient.Id.ToString()))
        {
            message.DateRead = DateTime.UtcNow;
        }
        else
        {
            var connections = await PresenceTracker.GetConnectionsForUser(recipient.Id);
            if (connections != null && connections?.Count != null)
            {
                await presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived", sender.UserName);
            }
        }

        unitOfWork.MessageRepository.AddMessage(message);

        if (await unitOfWork.Complete())
        {
            await Clients.Group(groupName).SendAsync("NewMessage", mapper.Map<MessageDto>(message));
        }
    }

    public async Task<Group> AddToGroup(string groupName)
    {
        var userId = Context.User?.GetUserId() ?? throw new Exception("Cannot get the user id");
        var group = await unitOfWork.MessageRepository.GetMessageGroup(groupName);
        var connection = new Connection { ConnectionId = Context.ConnectionId, UserId = userId.ToString() };

        if (group == null)
        {
            group = new Group { Name = groupName };
            unitOfWork.MessageRepository.AddGroup(group);
        }

        group.Connections.Add(connection);

        if (await unitOfWork.Complete())
        {
            return group;
        }

        throw new HubException("Failed to join group");
    }

    private async Task<Group> RemoveFromMessageGroup()
    {
        var group = await unitOfWork.MessageRepository.GetGroupForConnection(Context.ConnectionId);
        var connection = group?.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
        if (connection != null && group != null)
        {
            unitOfWork.MessageRepository.RemoveConnection(connection);
            if (await unitOfWork.Complete())
            {
                return group;
            }
        }

        throw new Exception("Failed to remove from group");
    }

    private string GetGroupName(int callerId, int? otherId)
    {
        var isCallerIdGreater = callerId > otherId;
        return isCallerIdGreater ? $"{otherId}-{callerId}" : $"{callerId}-{otherId}";
    }
}
