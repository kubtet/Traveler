using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : IdentityDbContext<User, AppRole, int, IdentityUserClaim<int>, UserAppRole,
    IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>(options)
{
    public required DbSet<Country> Countries { get; set; }
    public required DbSet<Follow> Follows { get; set; }
    public required DbSet<TravelLike> TravelLikes { get; set; }
    public required DbSet<Travel> Travels { get; set; }
    public required DbSet<TravelLike> Likes { get; set; }
    public required DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasMany(u => u.Travels)
            .WithOne(t => t.User)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Travel>()
            .HasMany(t => t.Photos)
            .WithOne(t => t.Travel)
            .HasForeignKey(t => t.TravelId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>()
            .HasMany(ur => ur.UserRoles)
            .WithOne(u => u.User)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AppRole>()
            .HasMany(ur => ur.UserRoles)
            .WithOne(u => u.Role)
            .HasForeignKey(ur => ur.RoleId)
            .IsRequired();

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
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Message>()
            .HasOne(x => x.Sender)
            .WithMany(x => x.MessagesSent)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
