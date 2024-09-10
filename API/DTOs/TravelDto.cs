public class TravelDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public IEnumerable<PhotoDto> Photos { get; set; }
    public IEnumerable<PlaceDto> Places { get; set; }
}
