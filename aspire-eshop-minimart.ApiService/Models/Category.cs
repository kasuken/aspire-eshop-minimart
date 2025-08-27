using System.Text.Json.Serialization;

namespace aspire_eshop_minimart.ApiService.Models;

public class Category
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property - ignore to prevent circular references
    [JsonIgnore]
    public ICollection<Product> Products { get; set; } = new List<Product>();
}