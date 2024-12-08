namespace API.DTOs;

public class UserStatisticsDto
{
    public required int TotalTravels { get; set; }
    public required int TotalCountries { get; set; }
    public required int TotalCities { get; set; }
    public required int TotalContinents { get; set; }

}