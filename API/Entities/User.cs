namespace API.Entities;

public class User
{
    public int Id { get; set; }
    public required string UserName { get; set; }
    public byte[] PasswordHash { get; set; } = [];
    public byte[] PasswordSalt { get; set; } = [];
    public required string Name { get; set; }
    public required string Surname { get; set; }
    public required string Email { get; set; }
    public required string Gender { get; set; }
    public string? Bio { get; set; }
    public string? ProfilePicture { get; set; }
    public required DateTime DateOfBirth { get; set; }
    public required DateTime CreationDate { get; set; } = DateTime.UtcNow;

    // relationships
    public List<Travel> Travels { get; set; } = new List<Travel>();
    public List<Follow> Followers { get; set; } = new List<Follow>();
    public List<Follow> Following { get; set; } = new List<Follow>();
}
