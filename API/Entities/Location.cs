namespace API.Entities
{
    public class Location
    {
        public int Id { get; set; }
        public required string Name { get; set; }  

        // Opcjonalnie: inne szczegóły lokalizacji
        public string? Description { get; set; }
        public string? Country { get; set; }

        public ICollection<WishListLocation> WishListLocations { get; set; } = new List<WishListLocation>();
    }
}
