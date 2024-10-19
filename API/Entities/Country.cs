namespace API.Entities
{
    public class Country
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Iso2 { get; set; }
    }
}