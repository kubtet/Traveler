namespace API.DTOs;

public class PlaceDto
{

    public int Id { get; set; }
    public string? Name { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
}
