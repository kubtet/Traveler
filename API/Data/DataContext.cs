using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<Country> Countries { get; set; }
    public required DbSet<Follow> Follows { get; set; }
    public required DbSet<TravelLike> TravelLikes { get; set; }
    public required DbSet<Travel> Travels { get; set; }
    public required DbSet<User> Users { get; set; }
    public required DbSet<TravelLike> Likes { get; set; }
    public required DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Follow>()
            .HasKey(f => new { f.SourceUserId, f.FollowedUserId });

        modelBuilder.Entity<Follow>()
            .HasOne(f => f.SourceUser)
            .WithMany(u => u.Following)
            .HasForeignKey(f => f.SourceUserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Follow>()
            .HasOne(f => f.FollowedUser)
            .WithMany(u => u.Followers)
            .HasForeignKey(f => f.FollowedUserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TravelLike>()
            .HasKey(l => new { l.UserId, l.TravelId });

        modelBuilder.Entity<TravelLike>()
            .HasOne(s => s.Travel)
            .WithMany(l => l.Likes)
            .HasForeignKey(f => f.TravelId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TravelLike>()
            .HasOne(s => s.User)
            .WithMany(l => l.LikedTravels)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Message>()
            .HasOne(x => x.Recipient)
            .WithMany(x => x.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(x => x.Sender)
            .WithMany(x => x.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
