using Healthcare.Domain.Common;

namespace Healthcare.Domain.Addresses;

public sealed class Address : AuditableEntity
{
    public Guid AddressId { get; set; }
    public string Wilaya { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string Commune { get; set; } = string.Empty;
    public string Rue { get; set; } = string.Empty;
    public int NumMaison { get; set; }
    public decimal Lat { get; set; }
    public decimal Lng { get; set; }

    public decimal CalculateDistance(Address other)
    {
        const double earthRadiusKm = 6371.0;

        double lat1 = DegreesToRadians((double)Lat);
        double lon1 = DegreesToRadians((double)Lng);
        double lat2 = DegreesToRadians((double)other.Lat);
        double lon2 = DegreesToRadians((double)other.Lng);

        double dLat = lat2 - lat1;
        double dLon = lon2 - lon1;

        double a = Math.Pow(Math.Sin(dLat / 2), 2) +
                   Math.Cos(lat1) * Math.Cos(lat2) * Math.Pow(Math.Sin(dLon / 2), 2);
        double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

        return (decimal)(earthRadiusKm * c);
    }

    private static double DegreesToRadians(double degrees)
    {
        return degrees * Math.PI / 180.0;
    }
}
