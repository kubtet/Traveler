using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Photos")]
    public class Photo
    {
        public int Id { get; set; }
        public required string Url { get; set; }
        public int? TravelId { get; set; }
        public Travel? Travel { get; set; } = null!;
        // Relationship with user if profile picture
        public int? UserId { get; set; }
        public User? User { get; set; }
        // Cloudify
        public string? PublicId { get; set; }
        // flag for profile piture
        public bool IsProfilePicture { get; set; } = false;
    }
}