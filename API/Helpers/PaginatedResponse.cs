namespace API.Helpers;

public class PaginatedResponse<T>(List<T> items, int currentPage, int totalPages, int pageSize, int totalCount)
{
    public List<T> Items { get; set; } = items;
    public int CurrentPage { get; set; } = currentPage;
    public int TotalPages { get; set; } = totalPages;
    public int PageSize { get; set; } = pageSize;
    public int TotalCount { get; set; } = totalCount;
}

