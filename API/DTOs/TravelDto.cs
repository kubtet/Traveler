namespace API.DTOs;
public class TravelDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }

    public DateTime StartDate { get; set; }
    // Lista URLi zdjęć
    public List<string>? PhotoUrls { get; set; }
}
