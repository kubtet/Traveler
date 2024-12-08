namespace API.DTOs;

public class NotificationDto
{
    public int Id { get; set; }
    public int NotifiedUser { get; set; }
    public int NotifiedBy { get; set; }
    public required string Content { get; set; }
    public DateTime DateOfNotification { get; set; }
}
