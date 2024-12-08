using API.DTOs;

namespace API.Interfaces;

public interface IStatisticsRepository
{
    Task<UserStatisticsDto> GetUserStatisticsAsync(int userId);
    Task<List<MonthyTripsDto>> GetMonthlyTripsForUserAsync(int userId);
    Task<List<TravelTimelineDto>> GetTravelTimelineDtosForUserAsync(int userId);
    Task<SeasonalTravelsDto> GetTripsBySeasonForUserAsync(int userId);
    Task<CountriesByContinentDto> GetCountriesByContinetForUserAsync(int userId);
}