using API.DTOs;
using API.Interfaces;
using AutoMapper;

namespace API.Repositories;


public class StatisticsRepository(ITravelRepository travelRepository, IMapper mapper) : IStatisticsRepository
{
    private static readonly Dictionary<int, string> MonthToSeason = new()
    {
        { 12, "Winter" }, { 1, "Winter" }, { 2, "Winter" },
        { 3, "Spring" }, { 4, "Spring" }, { 5, "Spring" },
        { 6, "Summer" }, { 7, "Summer" }, { 8, "Summer" },
        { 9, "Fall" }, { 10, "Fall" }, { 11, "Fall" }
    };

    public async Task<CountriesByContinentDto> GetCountriesByContinetForUserAsync(int userId)
    {
        var travels = await travelRepository.GetTravelsAsyncByUserId(userId);
        var countriesInContinents = new Dictionary<string, int>() {
            {"Europe", 0},
            {"Asia", 0},
            {"North America", 0},
            {"South America", 0},
            {"Africa", 0},
            {"Oceania", 0},
        };

        foreach (var travel in travels)
        {
            var continent = GeographyMapping.GetContinent(travel.CountryIso2Code);
            if (continent != "Unknown")
            {
                countriesInContinents[continent]++;
            }
        }

        return new CountriesByContinentDto
        {
            countriesEurope = countriesInContinents["Europe"],
            countriesAfrica = countriesInContinents["Africa"],
            countriesNorthAmerica = countriesInContinents["North America"],
            countriesSouthAmerica = countriesInContinents["South America"],
            countriesAsia = countriesInContinents["Asia"],
            countriesOceania = countriesInContinents["Oceania"]
        };
    }

    public async Task<List<MonthyTripsDto>> GetMonthlyTripsForUserAsync(int userId)
    {
        var travels = await travelRepository.GetTravelsAsyncByUserId(userId);
        var monthlyTrips = new Dictionary<(int Year, int Month), int>(); // data i wartość

        foreach (var travel in travels)
        {
            var startDate = travel.StartDate;
            var endDate = travel.EndDate ?? travel.StartDate;


            for (var date = startDate; date <= endDate; date = date.AddMonths(1))
            {
                if (monthlyTrips.ContainsKey((date.Year, date.Month)))
                {
                    monthlyTrips[(date.Year, date.Month)]++;
                }
                else
                {
                    monthlyTrips[(date.Year, date.Month)] = 1;
                }
            }
        }
        var MonthyTripsDto = monthlyTrips.Select(mt => new MonthyTripsDto
        {
            Month = mt.Key.Month,
            Year = mt.Key.Year,
            Date = new DateOnly(year: mt.Key.Year, month: mt.Key.Month, day: 1),
            TripCount = mt.Value,
        }).OrderBy(mt => mt.Year).ThenBy(mt => mt.Month).ToList();

        return MonthyTripsDto;
    }

    public async Task<List<TravelTimelineDto>> GetTravelTimelineDtosForUserAsync(int userId)
    {
        var travels = await travelRepository.GetTravelsAsyncByUserId(userId);
        var travelsTimelines = travels.Select(t => mapper.Map<TravelTimelineDto>(t))
            .OrderBy(t => t.StartDate)
            .ToList();
            
        return travelsTimelines;
    }

    public async Task<SeasonalTravelsDto> GetTripsBySeasonForUserAsync(int userId)
    {
        var travels = await travelRepository.GetTravelsAsyncByUserId(userId);
        var seasonalTrips = new Dictionary<string, int> {
            { "Winter", 0 },
            { "Spring", 0 },
            { "Summer", 0 },
            { "Fall", 0 }
        };

        foreach (var travel in travels)
        {
            var season = MonthToSeason[travel.StartDate.Month];
            seasonalTrips[season]++;
        }

        return new SeasonalTravelsDto
        {
            TotalTravelsWinter = seasonalTrips["Winter"],
            TotalTravelsSpring = seasonalTrips["Spring"],
            TotalTravelsSummer = seasonalTrips["Summer"],
            TotalTravelsAutumn = seasonalTrips["Fall"]
        };
    }

    public async Task<UserStatisticsDto> GetUserStatisticsAsync(int userId)
    {
        var travels = await travelRepository.GetTravelsAsyncByUserId(userId);
        var uniqueCountries = travels
            .Select(t => t.CountryName)
            .Distinct()
            .ToList();
        var uniqueCountriesCodes = travels
            .Select(t => t.CountryIso2Code)
            .Distinct()
            .ToList();
        var uniqueCities = travels
            .Where(t => t.Cities != null && t.Cities != "")
            .SelectMany(t => t.Cities!.Split(',')
            .Select(city => city.Trim()))
            .Distinct()
            .ToList();
        var uniqueContinents = uniqueCountriesCodes
            .Select(country => GeographyMapping.GetContinent(country))
            .Where(continent => continent != "Unknown")
            .Distinct()
            .ToList();
        return new UserStatisticsDto
        {
            TotalTravels = travels.Count,
            TotalCities = uniqueCities.Count,
            TotalCountries = uniqueCountries.Count,
            TotalContinents = uniqueContinents.Count
        };
    }
}