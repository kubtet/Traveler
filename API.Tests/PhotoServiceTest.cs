using API.Enums;
using API.Interfaces;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Moq;

namespace API.Tests;

[TestFixture]
public class PhotoServiceTest
{
    private Mock<IPhotoService> _photoServiceMock;

    [SetUp]
    public void Setup()
    {
        _photoServiceMock = new Mock<IPhotoService>();
    }

    [Test]
    public async Task AddPhotoAsync_ReturnsEmptyObjectIfFileNotGreaterThanZero()
    {
        var mockFile = new Mock<IFormFile>();
        mockFile.Setup(f => f.Length).Returns(0);

        _photoServiceMock
            .Setup(service => service.AddPhotoAsync(It.IsAny<IFormFile>(), TypeOfPhoto.Profile))
            .ReturnsAsync(new ImageUploadResult()); 
            
        var result = await _photoServiceMock.Object.AddPhotoAsync(mockFile.Object, TypeOfPhoto.Profile);

        Assert.NotNull(result);
        Assert.IsInstanceOf<ImageUploadResult>(result);
    }
}
