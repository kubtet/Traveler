using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<Follow> Follows { get; set; }
    public DbSet<Like> Likes { get; set; }
    public DbSet<Photo> Photos { get; set; } // Maybe unnecessary
    public DbSet<Place> Places { get; set; }
    public DbSet<Travel> Travels { get; set; }
    public DbSet<TravelPlace> TravelPlaces { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Follow>()
            .HasKey(f => new { f.FollowingUserId, f.FollowedUserId });

        modelBuilder.Entity<Follow>()
            .HasOne(f => f.FollowingUser)
            .WithMany(u => u.Following)
            .HasForeignKey(f => f.FollowingUserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Follow>()
            .HasOne(f => f.FollowedUser)
            .WithMany(u => u.Followers)
            .HasForeignKey(f => f.FollowedUserId)
            .OnDelete(DeleteBehavior.Cascade);
            
        modelBuilder.Entity<Like>()
            .HasKey(l => new { l.UserId, l.TravelId });

        modelBuilder.Entity<TravelPlace>()
            .HasKey(tp => new { tp.TravelId, tp.PlaceId });
    }


}
