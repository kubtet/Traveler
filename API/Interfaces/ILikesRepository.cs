using API.DTOs;

namespace API
{
    public interface ILikesRepository
    {
        // Dodaje polubienie do posta
        void AddLike(TravelLike like);

        // Usuwa polubienie z posta
        void DeleteLike(TravelLike like);

        // Liczy polubienia dla konkretnego wpisu podróżniczego
        Task<int> CountLikesForTravel(int travelId);

        // Pobiera identyfikatory użytkowników, którzy polubili dany post
        Task<IEnumerable<int>> GetCurrentTravelLikeIds(int travelId);

        // Sprawdza, czy użytkownik polubił daną podróż
        Task<TravelLike?> GetTravelLikeByUser(int travelId, int userId); 

        // Pobiera listę użytkowników, którzy polubili dany post
        Task<IEnumerable<MemberDto>> GetUsersWhoLikedTravel(int travelId);

        // Zapisuje zmiany do bazy danych
        Task<bool> SaveChanges();
    }
}
