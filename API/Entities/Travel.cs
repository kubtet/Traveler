namespace API.Entities;

public class Travel
{

    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public required string Location { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public int AppUserId { get; set; }
    public required AppUser AppUser { get; set; }  // Navigation property to AppUser

    // relationships
    public ICollection<TravelTag> TravelTags { get; set; } = new List<TravelTag>();
    public ICollection<Collaborator> Collaborators { get; set; } = new List<Collaborator>();
}