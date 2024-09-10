namespace API.Entities
{
    public class TravelPlace
    {
        public int TravelId { get; set; }
        public Travel Travel { get; set; } = null!;
        public int PlaceId { get; set; }
        public Place Place { get; set; } = null!;
    }
}