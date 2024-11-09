using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<Follow> Follows { get; set; }
    public DbSet<TravelLike> TravelLikes { get; set; }
    public DbSet<Photo> Photos { get; set; } // Maybe unnecessary
    public DbSet<Place> Places { get; set; }
    public DbSet<Travel> Travels { get; set; }
    public DbSet<TravelPlace> TravelPlaces { get; set; }
    public DbSet<User> Users { get; set; }

    public DbSet<TravelLike> Likes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

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




        modelBuilder.Entity<TravelPlace>()
            .HasKey(tp => new { tp.TravelId, tp.PlaceId });
    }


}
