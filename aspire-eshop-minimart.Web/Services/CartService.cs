using Microsoft.JSInterop;

namespace aspire_eshop_minimart.Web.Services;

public class CartService
{
    private readonly CartApiClient _cartApiClient;
    private readonly IJSRuntime _jsRuntime;
    private string? _sessionId;
    
    public event Action? OnCartChanged;
    
    public CartService(CartApiClient cartApiClient, IJSRuntime jsRuntime)
    {
        _cartApiClient = cartApiClient;
        _jsRuntime = jsRuntime;
    }

    public async Task<string> GetSessionIdAsync()
    {
        if (string.IsNullOrEmpty(_sessionId))
        {
            try
            {
                // Try to get session ID from localStorage
                _sessionId = await _jsRuntime.InvokeAsync<string>("localStorage.getItem", "cartSessionId");
                
                if (string.IsNullOrEmpty(_sessionId))
                {
                    // Generate new session ID and store it
                    _sessionId = Guid.NewGuid().ToString();
                    await _jsRuntime.InvokeVoidAsync("localStorage.setItem", "cartSessionId", _sessionId);
                }
            }
            catch
            {
                // Fallback if localStorage is not available
                _sessionId = Guid.NewGuid().ToString();
            }
        }
        
        return _sessionId;
    }

    public async Task<CartItem[]> GetCartItemsAsync()
    {
        try
        {
            var sessionId = await GetSessionIdAsync();
            return await _cartApiClient.GetCartAsync(sessionId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error getting cart items: {ex.Message}");
            return [];
        }
    }

    public async Task AddToCartAsync(int productId, int quantity = 1)
    {
        try
        {
            var sessionId = await GetSessionIdAsync();
            await _cartApiClient.AddToCartAsync(sessionId, productId, quantity);
            OnCartChanged?.Invoke();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error adding to cart: {ex.Message}");
            throw; // Re-throw so UI can handle the error
        }
    }

    public async Task UpdateCartItemAsync(int itemId, int quantity)
    {
        try
        {
            var sessionId = await GetSessionIdAsync();
            await _cartApiClient.UpdateCartItemAsync(sessionId, itemId, quantity);
            OnCartChanged?.Invoke();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating cart item: {ex.Message}");
            throw; // Re-throw so UI can handle the error
        }
    }

    public async Task RemoveFromCartAsync(int itemId)
    {
        try
        {
            var sessionId = await GetSessionIdAsync();
            await _cartApiClient.RemoveFromCartAsync(sessionId, itemId);
            OnCartChanged?.Invoke();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error removing from cart: {ex.Message}");
            throw; // Re-throw so UI can handle the error
        }
    }

    public async Task ClearCartAsync()
    {
        try
        {
            var sessionId = await GetSessionIdAsync();
            await _cartApiClient.ClearCartAsync(sessionId);
            OnCartChanged?.Invoke();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error clearing cart: {ex.Message}");
            throw; // Re-throw so UI can handle the error
        }
    }

    public async Task<decimal> GetCartTotalAsync()
    {
        try
        {
            var items = await GetCartItemsAsync();
            return items.Sum(item => item.Product.Price * item.Quantity);
        }
        catch
        {
            return 0;
        }
    }

    public async Task<int> GetCartItemCountAsync()
    {
        try
        {
            var items = await GetCartItemsAsync();
            return items.Sum(item => item.Quantity);
        }
        catch
        {
            return 0;
        }
    }
}