namespace API.DTOs;


public class MemberDto
{
    public int Id { get; set; }
    public string? Username { get; set; }

    public string? Name { get; set; }
    public string? Surname { get; set; }
    public string? Email { get; set; }
    public string? Gender { get; set; }
    public string? Bio { get; set; }
    public string? ProfilePicture { get; set; }
    public required DateTime DateOfBirth { get; set; }
    public required DateTime CreationDate { get; set; }

    // relationships
    public List<TravelDto>? Travels { get; set; }
    public List<FollowerDto>? Followers { get; set; }
    public List<FollowerDto>? Followees { get; set; }
}
