namespace API.Entities;

public class Notification
{
    public int Id { get; set; }
    public int NotifiedUser { get; set; }
    public int NotifiedBy { get; set; }
    public required string Content { get; set; }
    public DateTime DateOfNotification { get; set; } = DateTime.UtcNow;
}
