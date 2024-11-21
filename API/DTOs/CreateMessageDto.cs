namespace API.DTOs;

public class CreateMessageDto
{
    public required string Content { get; set; }
    public int RecipientId { get; set; }
}
