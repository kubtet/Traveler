namespace API.Entities
{
    public class WishListItem
    {
        public int Id { get; set; }
        public required string LocationName { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public int AppUserId { get; set; }
    }
}
