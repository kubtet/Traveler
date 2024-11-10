using API.Enums;
using CloudinaryDotNet.Actions;

namespace API.Interfaces;

public interface IPhotoService
{
    Task<ImageUploadResult> AddPhotoAsync(IFormFile file, TypeOfPhoto type);
    Task<DeletionResult> DeletePhotoAsync(string publicId);

}