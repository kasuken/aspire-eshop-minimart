# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["aspire-eshop-minimart.ApiService/aspire-eshop-minimart.ApiService.csproj", "aspire-eshop-minimart.ApiService/"]
COPY ["aspire-eshop-minimart.ServiceDefaults/aspire-eshop-minimart.ServiceDefaults.csproj", "aspire-eshop-minimart.ServiceDefaults/"]
RUN dotnet restore "aspire-eshop-minimart.ApiService/aspire-eshop-minimart.ApiService.csproj"

# Copy source code
COPY . .
WORKDIR "/src/aspire-eshop-minimart.ApiService"

# Build and publish
RUN dotnet build "aspire-eshop-minimart.ApiService.csproj" -c Release -o /app/build
RUN dotnet publish "aspire-eshop-minimart.ApiService.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

# Expose ports
EXPOSE 8080
EXPOSE 3010

ENTRYPOINT ["dotnet", "aspire-eshop-minimart.ApiService.dll"]
