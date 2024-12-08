namespace API.Entities;

public class Notification
{
    public int Id { get; set; }
    public required string Content { get; set; }
    public int NotifiedUserId { get; set; }
    public int NotifierId { get; set; }
    public User Notifier { get; set; } = null!;
    public DateTime DateOfNotification { get; set; } = DateTime.Now;
}
