using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class MessageRepository(DataContext context, IMapper mapper) : IMessageRepository
    {
        public void AddMessage(Message message)
        {
            context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            context.Messages.Remove(message);
        }

        public async Task<IEnumerable<MessageDto>> GetAllMessageThreads(int currentUserId)
        {
            var messages = await context.Messages
                .Where(m => m.SenderId == currentUserId || m.RecipientId == currentUserId)
                .OrderByDescending(m => m.MessageSent)
                .ProjectTo<MessageDto>(mapper.ConfigurationProvider)
                .ToListAsync();

            var threads = messages
                .GroupBy(m => m.SenderId == currentUserId ? m.RecipientId : m.SenderId)
                .Select(group => group.First())
                .ToList();

            return threads;
        }


        public async Task<Message?> GetMessage(int id)
        {
            return await context.Messages.FindAsync(id);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = context.Messages
                .OrderByDescending(m => m.MessageSent)
                .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(x => x.Recipient.Id == messageParams.UserId),
                "Outbox" => query.Where(x => x.Sender.Id == messageParams.UserId),
                _ => query.Where(x => x.Recipient.Id == messageParams.UserId && x.DateRead == null)
            };

            var messages = query.ProjectTo<MessageDto>(mapper.ConfigurationProvider);

            return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(int currentUserId, int recipientId)
        {
            var messages = await context.Messages
                .Include(m => m.Sender).ThenInclude(m => m.ProfilePhoto)
                .Include(m => m.Recipient).ThenInclude(m => m.ProfilePhoto)
                .Where(m => m.RecipientId == currentUserId && m.SenderId == recipientId || m.SenderId == currentUserId && m.RecipientId == recipientId)
                .OrderBy(m => m.MessageSent)
                .ToListAsync();

            var unreadMessages = messages.Where(m => m.DateRead == null && m.RecipientId == currentUserId).ToList();

            if (unreadMessages.Count != 0)
            {
                unreadMessages.ForEach(m => m.DateRead = DateTime.Now);
                await context.SaveChangesAsync();
            }

            return mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}