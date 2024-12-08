namespace API.DTOs;

public class NotificationDto
{
    public int Id { get; set; }
    public required string Content { get; set; }
    public int NotifiedUserId { get; set; }
    public int NotifierId { get; set; }
    public required string NotifierUsername { get; set; }
    public required string NotifierProfilePictureUrl { get; set; }
    public DateTime DateOfNotification { get; set; } = DateTime.UtcNow;
}
