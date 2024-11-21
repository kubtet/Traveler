using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessagesController(IMessageRepository messageRepository, IUserRepository userRepository, IMapper mapper) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
    {
        var userId = User.GetUserId();

        if (userId == createMessageDto.RecipientId)
        {
            return BadRequest("You cannot message yourself");
        }

        var sender = await userRepository.GetUserByIdAsync(userId);
        var recipient = await userRepository.GetUserByIdAsync(createMessageDto.RecipientId);

        if (sender == null || recipient == null)
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

        messageRepository.AddMessage(message);

        if (await messageRepository.SaveAllAsync())
        {
            return Ok(mapper.Map<MessageDto>(message));
        }

        return BadRequest("Failed to save message");
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
    {
        messageParams.UserId = User.GetUserId();

        var messages = await messageRepository.GetMessagesForUser(messageParams);

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

        return Ok(await messageRepository.GetMessageThread(currentUserId, userId));
    }

    [HttpGet("threads")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetAllMessageThreads()
    {
        var currentUserId = User.GetUserId();

        return Ok(await messageRepository.GetAllMessageThreads(currentUserId));
    }
}
