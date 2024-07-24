namespace API.Helpers;

public class StringFormatHelper
{
    public static string MakeFirstCapital(string str)
    {
        if (string.IsNullOrEmpty(str))
        {
            return string.Empty;
        }

        char[] letters = str.ToCharArray();

        letters[0] = char.ToUpper(letters[0]);

        return new string(letters);
    }
}
