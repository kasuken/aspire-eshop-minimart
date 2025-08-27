# Copilot Instructions for aspire-eshop-minimart

## Project Overview
- This is a modern eShop solution built with .NET Aspire (C#) for backend services and React (TypeScript) for the frontend.
- The solution includes API services, a web frontend, service defaults, and integration tests.
- Docker is used for containerization and deployment.

## Architecture
- Backend: ASP.NET Core Web API (C#), organized by domain (Models, Data, Services).
- Frontend: React (TypeScript), using Vite for build and development.
- Tests: xUnit for backend, React Testing Library/Jest for frontend.

## Coding Style
### C# (.NET Aspire)
- Use PascalCase for class, method, and property names.
- Use camelCase for local variables and parameters.
- Prefer explicit types over var unless type is obvious.
- Use async/await for asynchronous code.
- Organize code by feature/domain (e.g., Models, Data, Services).
- Use dependency injection for services.
- Add XML documentation for public classes and methods.

### TypeScript/React
- Use functional components and hooks.
- Use PascalCase for components, camelCase for variables/functions.
- Prefer arrow functions for callbacks and event handlers.
- Use TypeScript interfaces/types for props and state.
- Organize code in `src/components`, `src/services`, `src/pages`.
- Use CSS modules or styled-components for styling.

## Folder Structure
- Keep backend and frontend code in separate folders.
- Backend: `aspire-eshop-minimart.ApiService`, `aspire-eshop-minimart.Web`, `aspire-eshop-minimart.ServiceDefaults`, `aspire-eshop-minimart.AppHost`, `aspire-eshop-minimart.Tests`.
- Frontend: `aspire-eshop-react/src`, with subfolders for components, pages, services, and assets.

## API Usage
- Use RESTful conventions for API endpoints.
- Document API endpoints in code and with OpenAPI/Swagger if possible.
- Use DTOs for request/response models.
- Handle errors with appropriate status codes and messages.

## Testing
- Backend: Use xUnit for unit/integration tests. Place tests in `aspire-eshop-minimart.Tests`.
- Frontend: Use Jest and React Testing Library. Place tests in `aspire-eshop-react/src/__tests__`.
- Write tests for critical business logic and UI components.

## Documentation
- Add XML comments to C# public APIs.
- Use JSDoc for TypeScript functions/components.
- Keep README.md up to date with setup, build, and run instructions.

## Docker & Deployment
- Use multi-stage builds for Dockerfiles.
- Keep Dockerfiles in service root folders.
- Use environment variables for configuration.
- Document container ports and dependencies.

## Special Instructions
- Always follow SOLID principles in C# code.
- Prefer composition over inheritance.
- Use async APIs for I/O operations.
- In React, prefer controlled components and keep state minimal.
- Keep code DRY and modular.

---