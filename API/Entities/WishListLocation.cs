namespace API.Entities;

    public class WishListLocation
    {
         public int Id { get; set; } 
        public int WishListId { get; set; }
        public required WishList WishList { get; set; }

        public int LocationId { get; set; }
        public required Location Location { get; set; }
    }

