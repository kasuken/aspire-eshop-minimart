using Microsoft.EntityFrameworkCore;
using aspire_eshop_minimart.ApiService.Models;

namespace aspire_eshop_minimart.ApiService.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
        });

        // Seed some initial data
        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Name = "Apple", Description = "Fresh red apples", Price = 1.99m, StockQuantity = 100 },
            new Product { Id = 2, Name = "Banana", Description = "Ripe yellow bananas", Price = 0.99m, StockQuantity = 50 },
            new Product { Id = 3, Name = "Orange", Description = "Sweet oranges", Price = 2.49m, StockQuantity = 75 }
        );
    }
}