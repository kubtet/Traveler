using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class MessagesController(IUnitOfWork unitOfWork, IMapper mapper) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
    {
        var userId = User.GetUserId();

        if (userId == createMessageDto.RecipientId)
        {
            return BadRequest("You cannot message yourself");
        }

        var sender = await unitOfWork.UserRepository.GetUserByIdAsync(userId);
        var recipient = await unitOfWork.UserRepository.GetUserByIdAsync(createMessageDto.RecipientId);

        if (sender == null || recipient == null || sender.UserName == null || recipient.UserName == null)
        {
            return BadRequest("Cannot send message at this time");
        }

        var message = new Message
        {
            Sender = sender,
            Recipient = recipient,
            SenderUsername = sender.UserName,
            RecipientUsername = recipient.UserName,
            Content = createMessageDto.Content
        };

        unitOfWork.MessageRepository.AddMessage(message);

        if (await unitOfWork.Complete())
        {
            return Ok(mapper.Map<MessageDto>(message));
        }

        return BadRequest("Failed to save message");
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
    {
        messageParams.UserId = User.GetUserId();

        var messages = await unitOfWork.MessageRepository.GetMessagesForUser(messageParams);

        var messageDtos = messages.Select(mapper.Map<MessageDto>).ToList();

        var response = new PaginatedResponse<MessageDto>(
            messageDtos,
            messages.CurrentPage,
            messages.TotalPages,
            messages.PageSize,
            messages.TotalCount
        );

        return Ok(response);
    }

    [HttpGet("thread/{userId}")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(int userId)
    {
        var currentUserId = User.GetUserId();

        return Ok(await unitOfWork.MessageRepository.GetMessageThread(currentUserId, userId));
    }

    [HttpGet("threads")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetAllMessageThreads()
    {
        var currentUserId = User.GetUserId();

        return Ok(await unitOfWork.MessageRepository.GetAllMessageThreads(currentUserId));
    }

    [HttpGet("numberOfUnread")]
    public async Task<ActionResult<int>> GetNumberOfUnreadThreads()
    {
        var currentUserId = User.GetUserId();

        return Ok(await unitOfWork.MessageRepository.GetNumberOfUnreadThreads(currentUserId));
    }
}
