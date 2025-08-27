using Microsoft.EntityFrameworkCore;
using aspire_eshop_minimart.ApiService.Models;

namespace aspire_eshop_minimart.ApiService.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<CartItem> CartItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Category configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.ImageUrl).HasMaxLength(500);
        });

        // Product configuration
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.ImageUrl).HasMaxLength(500);
            
            entity.HasOne(e => e.Category)
                  .WithMany(c => c.Products)
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // CartItem configuration
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.SessionId).IsRequired().HasMaxLength(100);
            
            entity.HasOne(e => e.Product)
                  .WithMany()
                  .HasForeignKey(e => e.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasIndex(e => e.SessionId);
        });

        // Seed categories
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Fruits", Description = "Fresh fruits and produce", ImageUrl = "https://placehold.co/300x200?text=Fruits" },
            new Category { Id = 2, Name = "Vegetables", Description = "Fresh vegetables", ImageUrl = "https://placehold.co/300x200?text=Vegetables" },
            new Category { Id = 3, Name = "Dairy", Description = "Milk, cheese, and dairy products", ImageUrl = "https://placehold.co/300x200?text=Dairy" },
            new Category { Id = 4, Name = "Bakery", Description = "Fresh bread and baked goods", ImageUrl = "https://placehold.co/300x200?text=Bakery" },
            new Category { Id = 5, Name = "Beverages", Description = "Drinks and beverages", ImageUrl = "https://placehold.co/300x200?text=Beverages" }
        );

        // Seed products with more realistic data
        modelBuilder.Entity<Product>().HasData(
            // Fruits
            new Product { Id = 1, Name = "Red Apples", Description = "Fresh, crisp red apples perfect for snacking", Price = 2.99m, StockQuantity = 100, CategoryId = 1, IsFeatured = true, ImageUrl = "https://placehold.co/300x200?text=Red+Apples" },
            new Product { Id = 2, Name = "Bananas", Description = "Ripe yellow bananas, great source of potassium", Price = 1.49m, StockQuantity = 150, CategoryId = 1, IsFeatured = false, ImageUrl = "https://placehold.co/300x200?text=Bananas" },
            new Product { Id = 3, Name = "Orange Juice Oranges", Description = "Sweet and juicy oranges, perfect for fresh juice", Price = 3.99m, StockQuantity = 75, CategoryId = 1, IsFeatured = true, ImageUrl = "https://placehold.co/300x200?text=Oranges" },
            new Product { Id = 4, Name = "Fresh Strawberries", Description = "Sweet, ripe strawberries - perfect for desserts", Price = 4.99m, StockQuantity = 50, CategoryId = 1, IsFeatured = true, ImageUrl = "https://placehold.co/300x200?text=Strawberries" },
            
            // Vegetables
            new Product { Id = 5, Name = "Organic Carrots", Description = "Fresh organic carrots, great for cooking", Price = 2.49m, StockQuantity = 80, CategoryId = 2, IsFeatured = false, ImageUrl = "https://placehold.co/300x200?text=Carrots" },
            new Product { Id = 6, Name = "Fresh Broccoli", Description = "Nutrient-rich green broccoli", Price = 3.49m, StockQuantity = 60, CategoryId = 2, IsFeatured = false, ImageUrl = "https://placehold.co/300x200?text=Broccoli" },
            new Product { Id = 7, Name = "Bell Peppers Mix", Description = "Colorful mix of red, yellow, and green bell peppers", Price = 4.99m, StockQuantity = 40, CategoryId = 2, IsFeatured = true, ImageUrl = "https://placehold.co/300x200?text=Bell+Peppers" },
            
            // Dairy
            new Product { Id = 8, Name = "Whole Milk", Description = "Fresh whole milk, 1 gallon", Price = 3.99m, StockQuantity = 120, CategoryId = 3, IsFeatured = false, ImageUrl = "https://placehold.co/300x200?text=Milk" },
            new Product { Id = 9, Name = "Cheddar Cheese", Description = "Sharp cheddar cheese, aged to perfection", Price = 5.99m, StockQuantity = 30, CategoryId = 3, IsFeatured = true, ImageUrl = "https://placehold.co/300x200?text=Cheese" },
            
            // Bakery
            new Product { Id = 10, Name = "Artisan Bread", Description = "Freshly baked artisan sourdough bread", Price = 4.49m, StockQuantity = 25, CategoryId = 4, IsFeatured = true, ImageUrl = "https://placehold.co/300x200?text=Bread" },
            
            // Beverages
            new Product { Id = 11, Name = "Orange Juice", Description = "Fresh squeezed orange juice, no pulp", Price = 4.99m, StockQuantity = 45, CategoryId = 5, IsFeatured = false, ImageUrl = "https://placehold.co/300x200?text=Orange+Juice" },
            new Product { Id = 12, Name = "Sparkling Water", Description = "Refreshing sparkling water with natural minerals", Price = 2.99m, StockQuantity = 90, CategoryId = 5, IsFeatured = false, ImageUrl = "https://placehold.co/300x200?text=Sparkling+Water" }
        );
    }
}