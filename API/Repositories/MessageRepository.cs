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
        public void AddGroup(Group group)
        {
            context.Groups.Add(group);
        }

        public void AddMessage(Message message)
        {
            context.Messages.Add(message);

            var messagesInThreadCount = context.Messages
                .Where(m => m.RecipientId == message.RecipientId && m.SenderId == message.SenderId ||
                    m.SenderId == message.RecipientId && m.RecipientId == message.SenderId)
                .Count();


            if (messagesInThreadCount >= 100)
            {
                var messagesToRemove = context.Messages
                    .Where(m => m.RecipientId == message.RecipientId && m.SenderId == message.SenderId ||
                        m.SenderId == message.RecipientId && m.RecipientId == message.SenderId)
                    .OrderBy(m => m.MessageSent)
                    .Take(messagesInThreadCount - 100 + 1)
                    .ToList();

                context.Messages.RemoveRange(messagesToRemove);
            }
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

        public async Task<Connection?> GetConnection(string connectionId)
        {
            return await context.Connections.FindAsync(connectionId);
        }

        public async Task<Group?> GetGroupForConnection(string connectionId)
        {
            return await context.Groups
                .Include(g => g.Connections)
                .Where(g => g.Connections.Any(c => c.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
        }

        public async Task<Message?> GetMessage(int id)
        {
            return await context.Messages.FindAsync(id);
        }

        public async Task<Group?> GetMessageGroup(string groupName)
        {
            return await context.Groups
                .Include(g => g.Connections)
                .FirstOrDefaultAsync(g => g.Name == groupName);
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
            var query = context.Messages
                .Where(m => m.RecipientId == currentUserId && m.SenderId == recipientId || m.SenderId == currentUserId && m.RecipientId == recipientId)
                .OrderBy(m => m.MessageSent)
                .AsQueryable();

            var unreadMessages = query.Where(m => m.DateRead == null && m.RecipientId == currentUserId).ToList();

            if (unreadMessages.Count != 0)
            {
                unreadMessages.ForEach(m => m.DateRead = DateTime.Now);
                await context.SaveChangesAsync();
            }

            return await query.ProjectTo<MessageDto>(mapper.ConfigurationProvider).ToListAsync();
        }

        public async Task<int> GetNumberOfUnreadThreads(int currentUserId)
        {
            var messages = await context.Messages
                .Where(m => m.SenderId == currentUserId || m.RecipientId == currentUserId)
                .OrderByDescending(m => m.MessageSent)
                .ProjectTo<MessageDto>(mapper.ConfigurationProvider)
                .ToListAsync();

            var threads = messages
                .GroupBy(m => m.SenderId == currentUserId ? m.RecipientId : m.SenderId)
                .Select(group => group.First())
                .AsQueryable();

            var numberOfUnread = threads
                .Where(m => m.DateRead == null && m.RecipientId == currentUserId)
                .Count();

            return await Task.FromResult(numberOfUnread);
        }

        public void RemoveConnection(Connection connection)
        {
            context.Connections.Remove(connection);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}