namespace API.Helpers;

public class DataParams : PaginationParams
{
    public string? Username { get; set; }
    public int? CurrentUserId { get; set; }
    public int? UserId { get; set; }
}
