namespace API.Entities
{
    public class Place
    {
        public int Id { get; set; }
        public required string Name { get; set; } // Paris, France TO_DO
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }

        // relationship many to many with travels
        public ICollection<TravelPlace> TravelPlaces { get; set; } = new List<TravelPlace>();
    }
}