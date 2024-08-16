namespace API.Entities
{
    public class TravelTag
    {
        public int Id { get; set; }
        public int TravelId { get; set; }
        public required Travel Travel { get; set; }

        public int TagId { get; set; }
        public required Tag Tag { get; set; }
    }
}
