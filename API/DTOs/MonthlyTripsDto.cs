public class MonthyTripsDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public DateOnly Date { get; set; } // MM-yyyy
    public int TripCount { get; set; }
}