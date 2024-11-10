namespace API.DTOs;

public class PlaceDto
{
    public int Id { get; set; } // => country ID
    public required string CountryName { get; set; }
    public required string Cities { get; set; }
    public decimal Latitude { get; set; } // to be discussed
    public decimal Longitude { get; set; } // to be discussed
    public string? Region { get; set; }
}
