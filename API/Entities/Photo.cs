namespace API.Entities
{
    public class Photo
    {
        public int Id { get; set; }
        public int TravelId { get; set; }
        public required string Url { get; set; }
    }
}