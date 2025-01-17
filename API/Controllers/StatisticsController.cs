using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class StatisticsController(IUnitOfWork unitOfWork) : BaseApiController
{
    [HttpGet("{userId}")]
    public async Task<ActionResult<UserStatisticsDto>> GetStatisticsForUser(int userId)
    {
        var statistics = await unitOfWork.StatisticsRepository.GetUserStatisticsAsync(userId);
        return statistics;
    }

    [HttpGet("monthly-trips/{userId}")]
    public async Task<List<MonthyTripsDto>> GetMonthlyTrips(int userId)
    {
        var monthlyTrips = await unitOfWork.StatisticsRepository.GetMonthlyTripsForUserAsync(userId);
        return monthlyTrips;
    }


    [HttpGet("timeline-trips/{userId}")]
    public async Task<List<TravelTimelineDto>> GetTravelsTimeline(int userId)
    {
        var timelineTrips = await unitOfWork.StatisticsRepository.GetTravelTimelineDtosForUserAsync(userId);
        return timelineTrips;
    }



    [HttpGet("seasonal-trips/{userId}")]
    public async Task<SeasonalTravelsDto> GetSeasonalTrips(int userId)
    {
        var seasonalTrips = await unitOfWork.StatisticsRepository.GetTripsBySeasonForUserAsync(userId);
        return seasonalTrips;
    }


    [HttpGet("continents-trips/{userId}")]
    public async Task<CountriesByContinentDto> GetCountriesByContinent(int userId)
    {
        var countriesByContinet = await unitOfWork.StatisticsRepository.GetCountriesByContinetForUserAsync(userId);
        return countriesByContinet;
    }


}