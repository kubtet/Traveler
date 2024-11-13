using API.Entities;

public class TravelLike
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int TravelId { get; set; }
    public Travel Travel { get; set; } = null!;
}