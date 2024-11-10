namespace API;

using API.DTOs;
using API.Entities;

public interface IFollowsRepository
{
    void AddFollow(Follow follow); 
    void DeleteFollow(Follow follow); 
    Task<Follow?> GetFollow(int followerId, int followingId); // Sprawdza, czy istnieje śledzenie
    Task<IEnumerable<MemberDto>> GetFollowers(int userId); // Zwraca listę użytkowników, którzy śledzą usera
    Task<IEnumerable<MemberDto>> GetFollowings(int userId); // Zwraca listę użytkowników śledzonych przez usera
    Task<int> CountFollowers(int userId); // Liczy śledzących
    Task<int> CountFollowings(int userId); // Liczy śledzonych użytkowników    
    Task<bool> SaveChangesAsync(); // Zapisuje zmiany do bazy danych
}