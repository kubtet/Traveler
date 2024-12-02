using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class User : IdentityUser<int>
{
    public required string Name { get; set; }
    public required string Surname { get; set; }
    public string? Gender { get; set; }
    public string? Bio { get; set; }
    public Photo? ProfilePhoto { get; set; }
    public required DateTime DateOfBirth { get; set; }
    public required DateTime CreationDate { get; set; } = DateTime.UtcNow;

    // relationships
    public List<Travel> Travels { get; set; } = [];
    public List<Follow> Followers { get; set; } = []; // followed by 
    public List<Follow> Following { get; set; } = []; // followed
    public List<TravelLike> LikedTravels { get; set; } = [];
    public List<Message> MessagesSent { get; set; } = [];
    public List<Message> MessagesReceived { get; set; } = [];
    public ICollection<UserAppRole> UserRoles { get; set; } = [];
}
