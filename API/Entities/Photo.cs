using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Photos")]
    public class Photo
    {
        public int Id { get; set; }
        public required string Url { get; set; }

        // relationship with travel to have album gallery
        public int? TravelId { get; set; }
        public Travel? Travel { get; set; } = null!;
    


        // relationship with user for profile picture
        public int? UserId { get; set; } 
        public User? User { get; set; }

        public string? PublicId { get; set; } // needed for stroage

        // flag for profile piture
        public bool IsProfilePicture { get; set; } = false;
    }
}