using API.Enums;

namespace API.DTOs;

public class AddNotificationDto
{
    public int NotifiedUserId { get; set; }
    public string? TravelTitle { get; set; }
    public TypeOfNotification NotificationType { get; set; }
}
