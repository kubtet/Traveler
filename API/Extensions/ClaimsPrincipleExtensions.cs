using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static int GetUserId(this ClaimsPrincipal user)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                        ?? user.FindFirstValue("sub")
                        ?? throw new Exception("Cannot get id from token");
        if (!int.TryParse(userId, out int userIdInt))
        {
            throw new FormatException($"User ID '{userId}' is not a valid integer.");
        }
        return userIdInt;
    }
}