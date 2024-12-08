public class TravelTimelineDto
{
    public required string Country { get; set; }
    public string? Cities { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
