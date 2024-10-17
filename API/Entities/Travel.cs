namespace API.Entities
{
    public class Travel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public required DateTime CreatedAt { get; set; }

        //relation to user
        public User User { get; set; } = null!;

        // relationship many to many with places
        public List<TravelPlace> TravelPlaces { get; set; } = new List<TravelPlace>();
        public List<Photo> Photos { get; set; } = []; // Photo is navigation property inside travel class
    }
}