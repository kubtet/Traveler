namespace API.DTOs
{
    public class TravelDetailDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required string Username { get; set; }
        public required string ProfilePicture { get; set; }
        public DateTime DateOfBirth { get; set; }
        public List<string>? PlaceNames { get; set; }
        public List<string>? PhotoUrls { get; set; }
    }
}