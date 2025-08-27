using aspire_eshop_minimart.ApiService.Data;
using aspire_eshop_minimart.ApiService.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add database
builder.AddSqlServerDbContext<ApplicationDbContext>("defaultdb");

// Add services to the container.
builder.Services.AddProblemDetails();

// Configure JSON serialization to handle reference cycles
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.SerializerOptions.WriteIndented = true;
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add CORS for development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseCors("AllowAll");
}

// Ensure database is created and migrated
try
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        context.Database.EnsureCreated();
    }
}
catch (Exception ex)
{
    Console.WriteLine($"Database initialization error: {ex.Message}");
}

string[] summaries = ["Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"];

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

// Category endpoints
app.MapGet("/categories", async (ApplicationDbContext db) =>
{
    try
    {
        var categories = await db.Categories
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();
        return Results.Ok(categories);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error fetching categories: {ex.Message}");
        return Results.Problem("Error fetching categories");
    }
})
.WithName("GetCategories");

app.MapGet("/categories/{id}", async (int id, ApplicationDbContext db) =>
{
    try
    {
        var category = await db.Categories
            .Where(c => c.Id == id)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                CreatedAt = c.CreatedAt
            })
            .FirstOrDefaultAsync();
        return category is not null ? Results.Ok(category) : Results.NotFound();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error fetching category {id}: {ex.Message}");
        return Results.Problem($"Error fetching category {id}");
    }
})
.WithName("GetCategory");

// Product endpoints
app.MapGet("/products", async (ApplicationDbContext db, int? categoryId = null, bool? featured = null) =>
{
    try
    {
        var query = db.Products.Include(p => p.Category).AsQueryable();
        
        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);
            
        if (featured.HasValue)
            query = query.Where(p => p.IsFeatured == featured.Value);
        
        var products = await query
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                ImageUrl = p.ImageUrl,
                IsFeatured = p.IsFeatured,
                CategoryId = p.CategoryId,
                CreatedAt = p.CreatedAt,
                Category = new CategoryDto
                {
                    Id = p.Category.Id,
                    Name = p.Category.Name,
                    Description = p.Category.Description,
                    ImageUrl = p.Category.ImageUrl,
                    CreatedAt = p.Category.CreatedAt
                }
            })
            .ToListAsync();
        return Results.Ok(products);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error fetching products: {ex.Message}");
        return Results.Problem("Error fetching products");
    }
})
.WithName("GetProducts");

app.MapGet("/products/{id}", async (int id, ApplicationDbContext db) =>
{
    try
    {
        var product = await db.Products
            .Include(p => p.Category)
            .Where(p => p.Id == id)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                ImageUrl = p.ImageUrl,
                IsFeatured = p.IsFeatured,
                CategoryId = p.CategoryId,
                CreatedAt = p.CreatedAt,
                Category = new CategoryDto
                {
                    Id = p.Category.Id,
                    Name = p.Category.Name,
                    Description = p.Category.Description,
                    ImageUrl = p.Category.ImageUrl,
                    CreatedAt = p.Category.CreatedAt
                }
            })
            .FirstOrDefaultAsync();
        return product is not null ? Results.Ok(product) : Results.NotFound();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error fetching product {id}: {ex.Message}");
        return Results.Problem($"Error fetching product {id}");
    }
})
.WithName("GetProduct");

app.MapGet("/products/featured", async (ApplicationDbContext db) =>
{
    try
    {
        var products = await db.Products
            .Include(p => p.Category)
            .Where(p => p.IsFeatured)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                ImageUrl = p.ImageUrl,
                IsFeatured = p.IsFeatured,
                CategoryId = p.CategoryId,
                CreatedAt = p.CreatedAt,
                Category = new CategoryDto
                {
                    Id = p.Category.Id,
                    Name = p.Category.Name,
                    Description = p.Category.Description,
                    ImageUrl = p.Category.ImageUrl,
                    CreatedAt = p.Category.CreatedAt
                }
            })
            .ToListAsync();
        return Results.Ok(products);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error fetching featured products: {ex.Message}");
        return Results.Problem("Error fetching featured products");
    }
})
.WithName("GetFeaturedProducts");

app.MapGet("/products/category/{categoryId}", async (int categoryId, ApplicationDbContext db) =>
{
    try
    {
        var products = await db.Products
            .Include(p => p.Category)
            .Where(p => p.CategoryId == categoryId)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                ImageUrl = p.ImageUrl,
                IsFeatured = p.IsFeatured,
                CategoryId = p.CategoryId,
                CreatedAt = p.CreatedAt,
                Category = new CategoryDto
                {
                    Id = p.Category.Id,
                    Name = p.Category.Name,
                    Description = p.Category.Description,
                    ImageUrl = p.Category.ImageUrl,
                    CreatedAt = p.Category.CreatedAt
                }
            })
            .ToListAsync();
        return Results.Ok(products);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error fetching products for category {categoryId}: {ex.Message}");
        return Results.Problem($"Error fetching products for category {categoryId}");
    }
})
.WithName("GetProductsByCategory");

// Cart endpoints
app.MapGet("/cart/{sessionId}", async (string sessionId, ApplicationDbContext db) =>
{
    try
    {
        if (string.IsNullOrWhiteSpace(sessionId))
            return Results.BadRequest("Session ID is required");
            
        var cartItems = await db.CartItems
            .Include(ci => ci.Product)
            .ThenInclude(p => p.Category)
            .Where(ci => ci.SessionId == sessionId)
            .Select(ci => new CartItemDto
            {
                Id = ci.Id,
                SessionId = ci.SessionId,
                ProductId = ci.ProductId,
                Quantity = ci.Quantity,
                CreatedAt = ci.CreatedAt,
                Product = new ProductDto
                {
                    Id = ci.Product.Id,
                    Name = ci.Product.Name,
                    Description = ci.Product.Description,
                    Price = ci.Product.Price,
                    StockQuantity = ci.Product.StockQuantity,
                    ImageUrl = ci.Product.ImageUrl,
                    IsFeatured = ci.Product.IsFeatured,
                    CategoryId = ci.Product.CategoryId,
                    CreatedAt = ci.Product.CreatedAt,
                    Category = new CategoryDto
                    {
                        Id = ci.Product.Category.Id,
                        Name = ci.Product.Category.Name,
                        Description = ci.Product.Category.Description,
                        ImageUrl = ci.Product.Category.ImageUrl,
                        CreatedAt = ci.Product.Category.CreatedAt
                    }
                }
            })
            .ToListAsync();
            
        return Results.Ok(cartItems);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error fetching cart for session {sessionId}: {ex.Message}");
        return Results.Problem($"Error fetching cart for session {sessionId}");
    }
})
.WithName("GetCart");

app.MapPost("/cart/{sessionId}/add", async (string sessionId, CartItemRequest request, ApplicationDbContext db) =>
{
    try
    {
        if (string.IsNullOrWhiteSpace(sessionId))
            return Results.BadRequest("Session ID is required");
            
        if (request.ProductId <= 0)
            return Results.BadRequest("Valid Product ID is required");
            
        if (request.Quantity <= 0)
            return Results.BadRequest("Quantity must be greater than 0");
        
        // Check if product exists
        var productExists = await db.Products.AnyAsync(p => p.Id == request.ProductId);
        if (!productExists)
            return Results.NotFound("Product not found");
        
        var existingItem = await db.CartItems
            .FirstOrDefaultAsync(ci => ci.SessionId == sessionId && ci.ProductId == request.ProductId);
        
        if (existingItem != null)
        {
            existingItem.Quantity += request.Quantity;
        }
        else
        {
            var cartItem = new CartItem
            {
                SessionId = sessionId,
                ProductId = request.ProductId,
                Quantity = request.Quantity
            };
            db.CartItems.Add(cartItem);
        }
        
        await db.SaveChangesAsync();
        
        var cartItems = await db.CartItems
            .Include(ci => ci.Product)
            .ThenInclude(p => p.Category)
            .Where(ci => ci.SessionId == sessionId)
            .Select(ci => new CartItemDto
            {
                Id = ci.Id,
                SessionId = ci.SessionId,
                ProductId = ci.ProductId,
                Quantity = ci.Quantity,
                CreatedAt = ci.CreatedAt,
                Product = new ProductDto
                {
                    Id = ci.Product.Id,
                    Name = ci.Product.Name,
                    Description = ci.Product.Description,
                    Price = ci.Product.Price,
                    StockQuantity = ci.Product.StockQuantity,
                    ImageUrl = ci.Product.ImageUrl,
                    IsFeatured = ci.Product.IsFeatured,
                    CategoryId = ci.Product.CategoryId,
                    CreatedAt = ci.Product.CreatedAt,
                    Category = new CategoryDto
                    {
                        Id = ci.Product.Category.Id,
                        Name = ci.Product.Category.Name,
                        Description = ci.Product.Category.Description,
                        ImageUrl = ci.Product.Category.ImageUrl,
                        CreatedAt = ci.Product.Category.CreatedAt
                    }
                }
            })
            .ToListAsync();
            
        return Results.Ok(cartItems);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error adding item to cart: {ex.Message}");
        return Results.Problem("Error adding item to cart");
    }
})
.WithName("AddToCart");

app.MapPut("/cart/{sessionId}/update/{itemId}", async (string sessionId, int itemId, UpdateCartItemRequest updateRequest, ApplicationDbContext db) =>
{
    try
    {
        if (string.IsNullOrWhiteSpace(sessionId))
            return Results.BadRequest("Session ID is required");
            
        if (itemId <= 0)
            return Results.BadRequest("Valid Item ID is required");
        
        var cartItem = await db.CartItems
            .FirstOrDefaultAsync(ci => ci.Id == itemId && ci.SessionId == sessionId);
        
        if (cartItem == null)
            return Results.NotFound("Cart item not found");
        
        if (updateRequest.Quantity <= 0)
        {
            db.CartItems.Remove(cartItem);
        }
        else
        {
            cartItem.Quantity = updateRequest.Quantity;
        }
        
        await db.SaveChangesAsync();
        
        var result = await db.CartItems
            .Include(ci => ci.Product)
            .ThenInclude(p => p.Category)
            .Where(ci => ci.SessionId == sessionId)
            .Select(ci => new CartItemDto
            {
                Id = ci.Id,
                SessionId = ci.SessionId,
                ProductId = ci.ProductId,
                Quantity = ci.Quantity,
                CreatedAt = ci.CreatedAt,
                Product = new ProductDto
                {
                    Id = ci.Product.Id,
                    Name = ci.Product.Name,
                    Description = ci.Product.Description,
                    Price = ci.Product.Price,
                    StockQuantity = ci.Product.StockQuantity,
                    ImageUrl = ci.Product.ImageUrl,
                    IsFeatured = ci.Product.IsFeatured,
                    CategoryId = ci.Product.CategoryId,
                    CreatedAt = ci.Product.CreatedAt,
                    Category = new CategoryDto
                    {
                        Id = ci.Product.Category.Id,
                        Name = ci.Product.Category.Name,
                        Description = ci.Product.Category.Description,
                        ImageUrl = ci.Product.Category.ImageUrl,
                        CreatedAt = ci.Product.Category.CreatedAt
                    }
                }
            })
            .ToListAsync();
            
        return Results.Ok(result);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error updating cart item: {ex.Message}");
        return Results.Problem("Error updating cart item");
    }
})
.WithName("UpdateCartItem");

app.MapDelete("/cart/{sessionId}/remove/{itemId}", async (string sessionId, int itemId, ApplicationDbContext db) =>
{
    try
    {
        if (string.IsNullOrWhiteSpace(sessionId))
            return Results.BadRequest("Session ID is required");
            
        if (itemId <= 0)
            return Results.BadRequest("Valid Item ID is required");
        
        var cartItem = await db.CartItems
            .FirstOrDefaultAsync(ci => ci.Id == itemId && ci.SessionId == sessionId);
        
        if (cartItem == null)
            return Results.NotFound("Cart item not found");
        
        db.CartItems.Remove(cartItem);
        await db.SaveChangesAsync();
        
        return Results.Ok();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error removing cart item: {ex.Message}");
        return Results.Problem("Error removing cart item");
    }
})
.WithName("RemoveFromCart");

app.MapDelete("/cart/{sessionId}/clear", async (string sessionId, ApplicationDbContext db) =>
{
    try
    {
        if (string.IsNullOrWhiteSpace(sessionId))
            return Results.BadRequest("Session ID is required");
        
        var cartItems = await db.CartItems.Where(ci => ci.SessionId == sessionId).ToListAsync();
        if (cartItems.Any())
        {
            db.CartItems.RemoveRange(cartItems);
            await db.SaveChangesAsync();
        }
        
        return Results.Ok();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error clearing cart: {ex.Message}");
        return Results.Problem("Error clearing cart");
    }
})
.WithName("ClearCart");

app.MapDefaultEndpoints();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

record CartItemRequest(int ProductId, int Quantity);
record UpdateCartItemRequest(int Quantity);

// DTOs to prevent circular references
public record ProductDto
{
    public int Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public decimal Price { get; init; }
    public int StockQuantity { get; init; }
    public string? ImageUrl { get; init; }
    public bool IsFeatured { get; init; }
    public int CategoryId { get; init; }
    public DateTime CreatedAt { get; init; }
    public required CategoryDto Category { get; init; }
}

public record CategoryDto
{
    public int Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public string? ImageUrl { get; init; }
    public DateTime CreatedAt { get; init; }
}

public record CartItemDto
{
    public int Id { get; init; }
    public required string SessionId { get; init; }
    public int ProductId { get; init; }
    public int Quantity { get; init; }
    public DateTime CreatedAt { get; init; }
    public required ProductDto Product { get; init; }
}
