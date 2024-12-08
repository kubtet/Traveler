using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class StatisticsController(IStatisticsRepository statisticsRepository) : BaseApiController
    {
        [HttpGet("{userId}")]
        public async Task<ActionResult<UserStatisticsDto>> GetStatisticsForUser(int userId)
        {
            var statistics = await statisticsRepository.GetUserStatisticsAsync(userId);
            return statistics;
        }

        [HttpGet("monthly-trips/{userId}")]
        public async Task<List<MonthyTripsDto>> GetMonthlyTrips(int userId)
        {
            var monthlyTrips = await statisticsRepository.GetMonthlyTripsForUserAsync(userId);
            return monthlyTrips;
        }


        [HttpGet("timeline-trips/{userId}")]
        public async Task<List<TravelTimelineDto>> GetTravelsTimeline(int userId)
        {
            var timelineTrips = await statisticsRepository.GetTravelTimelineDtosForUserAsync(userId);
            return timelineTrips;
        }



        [HttpGet("seasonal-trips/{userId}")]
        public async Task<SeasonalTravelsDto> GetSeasonalTrips(int userId)
        {
            var seasonalTrips = await statisticsRepository.GetTripsBySeasonForUserAsync(userId);
            return seasonalTrips;
        }


        [HttpGet("continents-trips/{userId}")]
        public async Task<CountriesByContinentDto> GetCountriesByContinent(int userId)
        {
            var countriesByContinet = await statisticsRepository.GetCountriesByContinetForUserAsync(userId);
            return countriesByContinet;
        }



    }
}