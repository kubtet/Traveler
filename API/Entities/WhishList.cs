namespace API.Entities
{
    public class WishList
    {
        public int Id { get; set; }
        public string? Name { get; set; }  // Nazwa listy życzeń

        // Relacja z użytkownikiem
        public int AppUserId { get; set; }
        public required AppUser AppUser { get; set; }

        // Relacja z lokalizacjami
        public ICollection<WishListLocation> WishListLocations { get; set; } = new List<WishListLocation>();
    }
}
