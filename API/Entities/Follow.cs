namespace API.Entities
{
    public class Follow
    {
        public int FollowingUserId { get; set; }
        public int FollowedUserId { get; set; }
        public required DateTime CreatedAt { get; set; }
    }
}