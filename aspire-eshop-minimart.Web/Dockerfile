# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["aspire-eshop-minimart.Web/aspire-eshop-minimart.Web.csproj", "aspire-eshop-minimart.Web/"]
COPY ["aspire-eshop-minimart.ServiceDefaults/aspire-eshop-minimart.ServiceDefaults.csproj", "aspire-eshop-minimart.ServiceDefaults/"]
RUN dotnet restore "aspire-eshop-minimart.Web/aspire-eshop-minimart.Web.csproj"

# Copy source code
COPY . .
WORKDIR "/src/aspire-eshop-minimart.Web"

# Build and publish
RUN dotnet build "aspire-eshop-minimart.Web.csproj" -c Release -o /app/build
RUN dotnet publish "aspire-eshop-minimart.Web.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

# Expose port
EXPOSE 5100

ENTRYPOINT ["dotnet", "aspire-eshop-minimart.Web.dll"]
