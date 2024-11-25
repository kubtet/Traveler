﻿namespace API.Entities;

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

}
