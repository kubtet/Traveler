using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace API.Repositories;

public class NotificationRepository(DataContext context, IMapper mapper) : INotificationRepository
{
    public void AddNotification(Notification notification)
    {
        context.Notifications.Add(notification);
    }

    public async Task<Notification?> GetNotification(int id)
    {
        var notification = await context.Notifications.FindAsync(id);

        return notification;
    }

    public async Task<PagedList<NotificationDto>> GetNotificationsForUser(NotificationParams notificationParams)
    {
        var query = context.Notifications
            .Where(n => n.NotifiedUserId == notificationParams.UserId)
            .OrderByDescending(n => n.DateOfNotification)
            .AsQueryable();

        var notifications = query.ProjectTo<NotificationDto>(mapper.ConfigurationProvider);

        var pagedList = await PagedList<NotificationDto>.CreateAsync(notifications,
            notificationParams.PageNumber, notificationParams.PageSize);

        return pagedList;
    }

    public void RemoveNotification(Notification notification)
    {
        context.Notifications.Remove(notification);
    }

    public void RemoveNotifications(Notification[] notifications)
    {
        context.Notifications.RemoveRange(notifications);
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
