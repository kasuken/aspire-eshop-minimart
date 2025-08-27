namespace aspire_eshop_minimart.Web;

public class ProductApiClient(HttpClient httpClient)
{
    public async Task<Product[]> GetProductsAsync(int? categoryId = null, bool? featured = null, CancellationToken cancellationToken = default)
    {
        try
        {
            var query = "/products";
            var queryParams = new List<string>();
            
            if (categoryId.HasValue)
                queryParams.Add($"categoryId={categoryId}");
            if (featured.HasValue)
                queryParams.Add($"featured={featured}");
                
            if (queryParams.Any())
                query += "?" + string.Join("&", queryParams);
                
            var response = await httpClient.GetAsync(query, cancellationToken);
            response.EnsureSuccessStatusCode();
            
            return await response.Content.ReadFromJsonAsync<Product[]>(cancellationToken) ?? [];
        }
        catch (HttpRequestException ex)
        {
            Console.WriteLine($"Error fetching products: {ex.Message}");
            return [];
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unexpected error fetching products: {ex.Message}");
            return [];
        }
    }

    public async Task<Product?> GetProductAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await httpClient.GetAsync($"/products/{id}", cancellationToken);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<Product>(cancellationToken);
            }
            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching product {id}: {ex.Message}");
            return null;
        }
    }

    public async Task<Product[]> GetFeaturedProductsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await httpClient.GetAsync("/products/featured", cancellationToken);
            response.EnsureSuccessStatusCode();
            
            return await response.Content.ReadFromJsonAsync<Product[]>(cancellationToken) ?? [];
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching featured products: {ex.Message}");
            return [];
        }
    }

    public async Task<Product[]> GetProductsByCategoryAsync(int categoryId, CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await httpClient.GetAsync($"/products/category/{categoryId}", cancellationToken);
            response.EnsureSuccessStatusCode();
            
            return await response.Content.ReadFromJsonAsync<Product[]>(cancellationToken) ?? [];
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching products for category {categoryId}: {ex.Message}");
            return [];
        }
    }
}

public class CategoryApiClient(HttpClient httpClient)
{
    public async Task<Category[]> GetCategoriesAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await httpClient.GetAsync("/categories", cancellationToken);
            response.EnsureSuccessStatusCode();
            
            return await response.Content.ReadFromJsonAsync<Category[]>(cancellationToken) ?? [];
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching categories: {ex.Message}");
            return [];
        }
    }

    public async Task<Category?> GetCategoryAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await httpClient.GetAsync($"/categories/{id}", cancellationToken);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<Category>(cancellationToken);
            }
            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching category {id}: {ex.Message}");
            return null;
        }
    }
}

public class CartApiClient(HttpClient httpClient)
{
    public async Task<CartItem[]> GetCartAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await httpClient.GetAsync($"/cart/{sessionId}", cancellationToken);
            response.EnsureSuccessStatusCode();
            
            return await response.Content.ReadFromJsonAsync<CartItem[]>(cancellationToken) ?? [];
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching cart for session {sessionId}: {ex.Message}");
            return [];
        }
    }

    public async Task<CartItem[]> AddToCartAsync(string sessionId, int productId, int quantity, CancellationToken cancellationToken = default)
    {
        try
        {
            var request = new { ProductId = productId, Quantity = quantity };
            var response = await httpClient.PostAsJsonAsync($"/cart/{sessionId}/add", request, cancellationToken);
            response.EnsureSuccessStatusCode();
            
            return await response.Content.ReadFromJsonAsync<CartItem[]>(cancellationToken) ?? [];
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error adding product {productId} to cart: {ex.Message}");
            return [];
        }
    }

    public async Task<CartItem[]> UpdateCartItemAsync(string sessionId, int itemId, int quantity, CancellationToken cancellationToken = default)
    {
        try
        {
            var request = new { Quantity = quantity };
            var response = await httpClient.PutAsJsonAsync($"/cart/{sessionId}/update/{itemId}", request, cancellationToken);
            response.EnsureSuccessStatusCode();
            
            return await response.Content.ReadFromJsonAsync<CartItem[]>(cancellationToken) ?? [];
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating cart item {itemId}: {ex.Message}");
            return [];
        }
    }

    public async Task<bool> RemoveFromCartAsync(string sessionId, int itemId, CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await httpClient.DeleteAsync($"/cart/{sessionId}/remove/{itemId}", cancellationToken);
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error removing cart item {itemId}: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> ClearCartAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await httpClient.DeleteAsync($"/cart/{sessionId}/clear", cancellationToken);
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error clearing cart for session {sessionId}: {ex.Message}");
            return false;
        }
    }
}

// Data models for the web client
public record Product(int Id, string Name, string? Description, decimal Price, int StockQuantity, DateTime CreatedAt, string? ImageUrl, bool IsFeatured, int CategoryId, Category Category);
public record Category(int Id, string Name, string? Description, string? ImageUrl, DateTime CreatedAt);
public record CartItem(int Id, string SessionId, int ProductId, int Quantity, DateTime CreatedAt, Product Product);