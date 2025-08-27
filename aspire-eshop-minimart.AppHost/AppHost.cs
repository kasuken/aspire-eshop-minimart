using Google.Protobuf.WellKnownTypes;

var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");

var database = builder.AddSqlServer("sql")
    .AddDatabase("defaultdb");

var apiService = builder.AddProject<Projects.aspire_eshop_minimart_ApiService>("apiservice")
    .WithHttpHealthCheck("/health")
    .WithReference(database)
    .WaitFor(database)
    .WithHttpEndpoint(3010, 8080, "api");

// Blazor Web Frontend
builder.AddProject<Projects.aspire_eshop_minimart_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithHttpHealthCheck("/health")
    .WithReference(cache)
    .WaitFor(cache)
    .WithReference(apiService)
    .WaitFor(apiService);

// React Frontend
builder.AddNpmApp("react-frontend", "../aspire-eshop-react", "dev")
    .WithReference(apiService)
    .WaitFor(apiService)
    .WithEnvironment("VITE_API_URL", apiService.GetEndpoint("api"))
    //.WithHttpEndpoint(port: 3001, env: "PORT")
    .WithExternalHttpEndpoints();
    //.PublishAsDockerFile();

builder.Build().Run();
