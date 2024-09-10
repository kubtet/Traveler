namespace API;

public class FollowDto
{
     public int FollowingUserId { get; set; }
        public string FollowingUserName { get; set; } = null!;
        public string? FollowingUserProfilePicture { get; set; }

        public int FollowedUserId { get; set; }
        public string FollowedUserName { get; set; } = null!;
        public string? FollowedUserProfilePicture { get; set; }

        public DateTime CreatedAt { get; set; }
}