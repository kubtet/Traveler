using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    public required string Username { get; set; }

    [Required]
    public required string Password { get; set; }

    [Required]
    public required string Name { get; set; }

    [Required]
    public required string Surname { get; set; }

    [Required]
    public required string Email { get; set; }
    public string? Gender { get; set; }

    [Required]
    public required DateTime DateOfBirth { get; set; }
}
