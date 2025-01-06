namespace API.DTOs
{
    public class CreateTravelDto
    {
        public string? Cities { get; set; }
        public required string CountryName { get; set; }
        public required string CountryIso2Code { get; set; }
        public string? Description { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime StartDate { get; set; }
        public required string Title { get; set; }
        public int UserId { get; set; }
    }
}