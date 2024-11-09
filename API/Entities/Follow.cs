namespace API.Entities
{
    public class Follow
    {
        public int SourceUserId { get; set; }
        public User SourceUser { get; set; } = null!;
        public int FollowedUserId { get; set; }
        public User FollowedUser { get; set; } = null!;
        public required DateTime CreatedAt { get; set; }
    }
}