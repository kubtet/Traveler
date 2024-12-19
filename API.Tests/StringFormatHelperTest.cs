using API.Helpers;

namespace API.Tests;

[TestFixture]
public class Tests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void MakeFirstCapital_ReturnsStringInCorrectFormat()
    {
        var result = StringFormatHelper.MakeFirstCapital("abc");
        Assert.That(result, Is.EqualTo("Abc"));
    }

    [Test]
    public void MakeFirstCapital_ReturnsEmptyIfInputIsEmpty()
    {
        var result = StringFormatHelper.MakeFirstCapital("");
        Assert.That(result, Is.EqualTo(string.Empty));
    }
}