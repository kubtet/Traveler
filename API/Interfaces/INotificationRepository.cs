using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface INotificationRepository
{
    void AddNotification(Notification notification);
    Task<Notification?> GetNotification(int id);
    Task<PagedList<NotificationDto>> GetNotificationsForUser(NotificationParams notificationParams);
    Task<int> GetNumberOfUnreadNotifications(int currentUserId);
    void RemoveNotification(Notification notification);
    void RemoveNotifications(Notification[] notifications);
    Task<bool> SaveAllAsync();
}
