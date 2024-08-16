namespace API.Entities;
public class Collaborator
{
    public int Id { get; set; }


    public int TravelId { get; set; }
    public required Travel Travel { get; set; }

    // foreign key to the user who is collaborating
    public int AppUserId { get; set; }

    public DateTime JoinedDate { get; set; } = DateTime.UtcNow;
}
