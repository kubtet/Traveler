using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API;

public class Seed
{
    public static async Task SeedUsers(DataContext context)
    {
        if (await context.Users.AnyAsync()) return;

        var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var users = JsonSerializer.Deserialize<List<User>>(userData, options);

        if (users == null) return;
        foreach (var user in users)
        {
            using var hmac = new HMACSHA512();
            // user.UserName = user.UserName.ToLower() TODO
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("abc123"));
            user.PasswordSalt = hmac.Key;
            context.Users.Add(user);
        }
        await context.SaveChangesAsync();
    }

    // public static async Task SeedFollows(DataContext context)
    // {
    //     if (await context.Follows.AnyAsync()) return;
    //     var followsData = await File.ReadAllTextAsync("Data/FollowsSeedData.json");
    //     var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
    //     var follows = JsonSerializer.Deserialize<List<Follow>>(followsData, options);
    //     if (follows == null) return;

    //     foreach (var follow in follows)
    //     {
    //         context.Follows.Add(follow);
    //     }
    //     await context.SaveChangesAsync();

    // }

    public static async Task SeedFollows(DataContext context)
    {
        if (await context.Follows.AnyAsync()) return; // Sprawdza, czy istnieją już jakieś rekordy

        var followsData = await File.ReadAllTextAsync("Data/FollowsSeedData.json");
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var follows = JsonSerializer.Deserialize<List<Follow>>(followsData, options);

        if (follows == null) return;

        foreach (var follow in follows)
        {
            // Upewnij się, że relacje są prawidłowo ustawione
            var SourceUser = await context.Users.FindAsync(follow.SourceUserId);
            var followedUser = await context.Users.FindAsync(follow.FollowedUserId);

            if (SourceUser != null && followedUser != null)
            {
                follow.SourceUser = SourceUser;
                follow.FollowedUser = followedUser;
                context.Follows.Add(follow);
            }
        }
        await context.SaveChangesAsync();
    }

    public static async Task SeedCountries(DataContext context)
    {
        if (await context.Countries.AnyAsync()) return;
        var countriesData = await File.ReadAllTextAsync("Data/CountriesSeedData.json");
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var countries = JsonSerializer.Deserialize<List<Country>>(countriesData, options);
        if (countries == null) return;
        foreach (var country in countries)
        {
            context.Countries.Add(country);
        }
        await context.SaveChangesAsync();
    }

}