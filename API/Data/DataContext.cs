using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<AppUser> Users { get; set; }
    public DbSet<Travel> Travels { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<TravelTag> TravelTags { get; set; }
    public DbSet<WishList> WishLists { get; set; }
    public DbSet<WishListItem> WishListItems { get; set; }
    public DbSet<WishListLocation> WishListLocations { get; set; }
}
