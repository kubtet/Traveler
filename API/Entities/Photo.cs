using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Photos")]
    public class Photo
    {
        public int Id { get; set; }
        public int TravelId { get; set; }
        public Travel Travel { get; set; } = null!;
        public required string Url { get; set; }

        public string? PublicId { get; set; } // needed for stroage
    }
}