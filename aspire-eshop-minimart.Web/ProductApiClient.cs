namespace aspire_eshop_minimart.Web;

public class ProductApiClient(HttpClient httpClient)
{
    public async Task<Product[]> GetProductsAsync(CancellationToken cancellationToken = default)
    {
        return await httpClient.GetFromJsonAsync<Product[]>("/products", cancellationToken) ?? [];
    }

    public async Task<Product?> GetProductAsync(int id, CancellationToken cancellationToken = default)
    {
        var response = await httpClient.GetAsync($"/products/{id}", cancellationToken);
        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadFromJsonAsync<Product>(cancellationToken);
        }
        return null;
    }

    public async Task<Product?> CreateProductAsync(Product product, CancellationToken cancellationToken = default)
    {
        var response = await httpClient.PostAsJsonAsync("/products", product, cancellationToken);
        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadFromJsonAsync<Product>(cancellationToken);
        }
        return null;
    }
}

public record Product(int Id, string Name, string? Description, decimal Price, int StockQuantity, DateTime CreatedAt);