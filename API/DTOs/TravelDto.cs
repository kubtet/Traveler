namespace API.DTOs;
public class TravelDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    // Lista URLi zdjęć
    public List<string>? PhotosUrl { get; set; }

    // Lista nazw miejsc
    public List<string>? PlacesNames { get; set; }
}
