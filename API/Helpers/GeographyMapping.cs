public static class GeographyMapping
{
    public static readonly Dictionary<string, string> CountryISO2CodeToContinent = new()
    {
    { "AF", "Asia" },
    { "AL", "Europe" },
    { "AM", "Asia" },
    { "AO", "Africa" },
    { "AR", "South America" },
    { "AS", "Oceania" },
    { "AT", "Europe" },
    { "AU", "Oceania" },
    { "AW", "North America" },
    { "AX", "Europe" },
    { "AZ", "Asia" },
    { "BA", "Europe" },
    { "BB", "North America" },
    { "BD", "Asia" },
    { "BE", "Europe" },
    { "BF", "Africa" },
    { "BG", "Europe" },
    { "BH", "Asia" },
    { "BI", "Africa" },
    { "BJ", "Africa" },
    { "BL", "North America" },
    { "BM", "North America" },
    { "BN", "Asia" },
    { "BO", "South America" },
    { "BQ", "Oceania" },
    { "BR", "South America" },
    { "BS", "North America" },
    { "BT", "Asia" },
    { "BV", "Antarctica" },
    { "BW", "Africa" },
    { "BY", "Europe" },
    { "BZ", "North America" },
    { "CA", "North America" },
    { "CC", "Oceania" },
    { "CD", "Africa" },
    { "CF", "Africa" },
    { "CG", "Africa" },
    { "CH", "Europe" },
    { "CI", "Africa" },
    { "CK", "Oceania" },
    { "CL", "South America" },
    { "CM", "Africa" },
    { "CN", "Asia" },
    { "CO", "South America" },
    { "CR", "North America" },
    { "CU", "North America" },
    { "CV", "Africa" },
    { "CW", "North America" },
    { "CX", "Oceania" },
    { "CY", "Europe" },
    { "CZ", "Europe" },
    { "DE", "Europe" },
    { "DJ", "Africa" },
    { "DK", "Europe" },
    { "DM", "North America" },
    { "DO", "North America" },
    { "DZ", "Africa" },
    { "EC", "South America" },
    { "EE", "Europe" },
    { "EG", "Africa" },
    { "EH", "Africa" },
    { "ER", "Africa" },
    { "ES", "Europe" },
    { "ET", "Africa" },
    { "FI", "Europe" },
    { "FJ", "Oceania" },
    { "FM", "Oceania" },
    { "FO", "Europe" },
    { "FR", "Europe" },
    { "GA", "Africa" },
    { "GB", "Europe" },
    { "GD", "North America" },
    { "GE", "Asia" },
    { "GF", "South America" },
    { "GG", "Europe" },
    { "GH", "Africa" },
    { "GI", "Europe" },
    { "GL", "North America" },
    { "GM", "Africa" },
    { "GN", "Africa" },
    { "GP", "North America" },
    { "GQ", "Africa" },
    { "GR", "Europe" },
    { "GT", "North America" },
    { "GU", "Oceania" },
    { "GW", "Africa" },
    { "GY", "South America" },
    { "HK", "Asia" },
    { "HM", "Antarctica" },
    { "HN", "North America" },
    { "HR", "Europe" },
    { "HT", "North America" },
    { "HU", "Europe" },
    { "ID", "Asia" },
    { "IE", "Europe" },
    { "IL", "Asia" },
    { "IM", "Europe" },
    { "IN", "Asia" },
    { "IO", "Asia" },
    { "IQ", "Asia" },
    { "IR", "Asia" },
    { "IS", "Europe" },
    { "IT", "Europe" },
    { "JE", "Europe" },
    { "JM", "North America" },
    { "JO", "Asia" },
    { "JP", "Asia" },
    { "KE", "Africa" },
    { "KG", "Asia" },
    { "KH", "Asia" },
    { "KI", "Oceania" },
    { "KM", "Africa" },
    { "KN", "North America" },
    { "KP", "Asia" },
    { "KR", "Asia" },
    { "KW", "Asia" },
    { "KY", "North America" },
    { "KZ", "Asia" },
    { "LA", "Asia" },
    { "LB", "Asia" },
    { "LC", "North America" },
    { "LI", "Europe" },
    { "LK", "Asia" },
    { "LR", "Africa" },
    { "LS", "Africa" },
    { "LT", "Europe" },
    { "LU", "Europe" },
    { "LV", "Europe" },
    { "LY", "Africa" },
    { "MA", "Africa" },
    { "MC", "Europe" },
    { "MD", "Europe" },
    { "ME", "Europe" },
    { "MF", "North America" },
    { "MG", "Africa" },
    { "MH", "Oceania" },
    { "MK", "Europe" },
    { "ML", "Africa" },
    { "MM", "Asia" },
    { "MN", "Asia" },
    { "MO", "Asia" },
    { "MP", "North America" },
    { "MQ", "North America" },
    { "MR", "Africa" },
    { "MS", "North America" },
    { "MT", "Europe" },
    { "MU", "Africa" },
    { "MV", "Asia" },
    { "MW", "Africa" },
    { "MX", "North America" },
    { "MY", "Asia" },
    { "MZ", "Africa" },
    { "NA", "Africa" },
    { "NC", "Oceania" },
    { "NE", "Africa" },
    { "NF", "Oceania" },
    { "NG", "Africa" },
    { "NI", "North America" },
    { "NL", "Europe" },
    { "NO", "Europe" },
    { "NP", "Asia" },
    { "NR", "Oceania" },
    { "NU", "Oceania" },
    { "NZ", "Oceania" },
    { "OM", "Asia" },
    { "PA", "North America" },
    { "PE", "South America" },
    { "PF", "Oceania" },
    { "PG", "Oceania" },
    { "PH", "Asia" },
    { "PK", "Asia" },
    { "PL", "Europe" },
    { "PM", "North America" },
    { "PN", "Oceania" },
    { "PR", "North America" },
    { "PT", "Europe" },
    { "PW", "Oceania" },
    { "PY", "South America" },
    { "QA", "Asia" },
    { "RE", "Europe" },
    { "RO", "Europe" },
    { "RS", "Europe" },
    { "RU", "Europe" },
    { "RW", "Africa" },
    { "SA", "Asia" },
    { "SB", "Oceania" },
    { "SC", "Africa" },
    { "SD", "Africa" },
    { "SE", "Europe" },
    { "SG", "Asia" },
    { "SH", "Africa" },
    { "SI", "Europe" },
    { "SJ", "Europe" },
    { "SK", "Europe" },
    { "SL", "Africa" },
    { "SM", "Europe" },
    { "SN", "Africa" },
    { "SO", "Africa" },
    { "SR", "South America" },
    { "SS", "Africa" },
    { "ST", "Africa" },
    { "SV", "North America" },
    { "SX", "North America" },
    { "SY", "Asia" },
    { "SZ", "Africa" },
    { "TC", "North America" },
    { "TD", "Africa" },
    { "TF", "Antarctica" },
    { "TG", "Africa" },
    { "TH", "Asia" },
    { "TJ", "Asia" },
    { "TK", "Oceania" },
    { "TL", "Asia" },
    { "TM", "Asia" },
    { "TN", "Africa" },
    { "TO", "Oceania" },
    { "TR", "Asia" },
    { "TT", "North America" },
    { "TV", "Oceania" },
    { "TZ", "Africa" },
    { "UA", "Europe" },
    { "UG", "Africa" },
    { "US", "North America" },
    { "UY", "South America" },
    { "UZ", "Asia" },
    { "VA", "Europe" },
    { "VC", "North America" },
    { "VE", "South America" },
    { "VG", "North America" },
    { "VI", "North America" },
    { "VN", "Asia" },
    { "VU", "Oceania" },
    { "WF", "Oceania" },
    { "WS", "Oceania" },
    { "YE", "Asia" },
    { "YT", "Africa" },
    { "ZA", "Africa" },
    { "ZM", "Africa" },
    { "ZW", "Africa" }
};

    public static string GetContinent(string countryISO2Code)
    {
        return CountryISO2CodeToContinent.TryGetValue(countryISO2Code, out var continent)
        ? continent
        : "Unknown";
    }
}