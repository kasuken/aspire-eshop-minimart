# Aspire eShop MiniMart

A modern eShop demo project built to showcase the power and potential of **.NET Aspire** for cloud-native development. This solution combines a robust backend with a React frontend, demonstrating best practices for scalable, observable, and maintainable applications.

## Blazor Frontend

<img width="2495" height="1466" alt="image" src="https://github.com/user-attachments/assets/284b30c5-cca2-4fdd-82a0-af91162eb1f3" />

## Read Frontend

<img width="2470" height="1162" alt="image" src="https://github.com/user-attachments/assets/2b4caf0d-4335-4a77-a92c-f1d84c021b43" />

## .NET Aspire Dashboard

<img width="2490" height="495" alt="image" src="https://github.com/user-attachments/assets/51ffffb4-d53e-4af0-a3b2-7a130f5a1582" />

---

## 🚀 Purpose
This project is designed for:
- Live demos at events and conferences
- Blog posts and technical articles
- Exploring .NET Aspire features in real-world scenarios
- Learning and teaching modern .NET cloud-native development

## 🏗️ Architecture
- **Backend:** ASP.NET Core Web API (C#) using .NET Aspire for orchestration, service defaults, and observability
- **Frontend:** React (TypeScript) with Vite
- **Containerization:** Docker for all services
- **Testing:** xUnit for backend, Jest/React Testing Library for frontend

```
aspire-eshop-minimart.sln
├── aspire-eshop-minimart.ApiService      # ASP.NET Core API (Products, Cart, Categories)
├── aspire-eshop-minimart.Web             # React frontend (Vite)
├── aspire-eshop-minimart.ServiceDefaults # Shared service defaults for Aspire
├── aspire-eshop-minimart.AppHost         # Aspire AppHost for orchestration
├── aspire-eshop-minimart.Tests           # xUnit integration tests
└── aspire-eshop-react                    # React app source
```

## ✨ .NET Aspire Highlights
- **Service Orchestration:** Easily manage multiple services and dependencies
- **Observability:** Built-in support for metrics, logging, and distributed tracing
- **Cloud-Native Patterns:** Environment configuration, health checks, and service defaults
- **Rapid Local Development:** Run all services together with minimal setup

## 🛠️ Getting Started
### Prerequisites
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js & npm](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Clone the Repository
```sh
git clone https://github.com/kasuken/aspire-eshop-minimart.git
cd aspire-eshop-minimart
```

### Run the Frontend
```sh
cd aspire-eshop-react
npm install
```

### Run with .NET Aspire
```sh
dotnet run --project aspire-eshop-minimart.AppHost
```
This will start all backend services orchestrated by Aspire.


## 🧑‍💻 Demo Scenarios
- Show service orchestration and health checks in Aspire AppHost
- Demonstrate distributed tracing and metrics
- Live code updates with hot reload
- API integration between backend and React frontend
- Containerization and cloud readiness

## 📚 Resources
- [.NET Aspire Documentation](https://learn.microsoft.com/dotnet/aspire/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contributing
Contributions are welcome! Please open issues or pull requests for improvements, bug fixes, or new demo scenarios.

## 📄 License
This project is licensed under the MIT License. See `LICENSE.txt` for details.

---

> **Showcase the future of .NET cloud-native development with Aspire!**
