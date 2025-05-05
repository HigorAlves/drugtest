# New API Structure Following DDD, Clean Architecture, and Hexagonal Architecture

## Overview

This document outlines the new folder structure for the API application following Domain-Driven Design (DDD), Clean Architecture, and Hexagonal Architecture principles.

## Folder Structure

```
src/
├── application/                  # Application layer (use cases)
│   ├── auth/                     # Authentication use cases
│   ├── drugs/                    # Drug-related use cases
│   ├── indications/              # Indication-related use cases
│   ├── users/                    # User-related use cases
│   └── common/                   # Shared application logic
│
├── domain/                       # Domain layer (business logic)
│   ├── models/                   # Domain models
│   ├── repositories/             # Repository interfaces
│   ├── services/                 # Domain services
│   └── events/                   # Domain events
│
├── infrastructure/               # Infrastructure layer (adapters)
│   ├── config/                   # Configuration
│   ├── database/                 # Database adapters
│   │   ├── entities/             # ORM entities
│   │   ├── repositories/         # Repository implementations
│   │   └── migrations/           # Database migrations
│   ├── http/                     # HTTP adapters
│   │   ├── controllers/          # NestJS controllers
│   │   ├── dtos/                 # Data Transfer Objects
│   │   └── middlewares/          # HTTP middlewares
│   ├── security/                 # Security adapters
│   │   ├── guards/               # NestJS guards
│   │   └── strategies/           # Authentication strategies
│   └── external/                 # External services adapters
│       ├── scraper/              # Scraper service
│       └── mapping/              # Indication mapping service
│
└── main.ts                       # Application entry point
```

## Explanation

### Domain Layer

The domain layer contains the business logic and rules of the application. It's independent of any external frameworks or technologies.

- **models/**: Domain models like Drug, Indication, User, etc.
- **repositories/**: Interfaces for repositories (no implementation details)
- **services/**: Domain services that implement business logic
- **events/**: Domain events for communication between domains

### Application Layer

The application layer contains the use cases of the application. It orchestrates the flow of data to and from the domain layer.

- **auth/**: Authentication use cases
- **drugs/**: Drug-related use cases
- **indications/**: Indication-related use cases
- **users/**: User-related use cases
- **common/**: Shared application logic

### Infrastructure Layer

The infrastructure layer contains adapters that implement the interfaces defined in the domain layer. It's responsible for communicating with external systems.

- **config/**: Configuration for the application
- **database/**: Database adapters
  - **entities/**: ORM entities
  - **repositories/**: Repository implementations
  - **migrations/**: Database migrations
- **http/**: HTTP adapters
  - **controllers/**: NestJS controllers
  - **dtos/**: Data Transfer Objects
  - **middlewares/**: HTTP middlewares
- **security/**: Security adapters
  - **guards/**: NestJS guards
  - **strategies/**: Authentication strategies
- **external/**: External services adapters
  - **scraper/**: Scraper service
  - **mapping/**: Indication mapping service

## Migration Plan

1. Create the new folder structure
2. Move domain models from packages/domain to src/domain/models
3. Create repository interfaces in src/domain/repositories
4. Move database entities to src/infrastructure/database/entities
5. Implement repository interfaces in src/infrastructure/database/repositories
6. Move controllers to src/infrastructure/http/controllers
7. Move DTOs to src/infrastructure/http/dtos
8. Create use cases in src/application
9. Move guards and strategies to src/infrastructure/security
10. Move external services to src/infrastructure/external
11. Update imports and dependencies
12. Update NestJS modules to reflect the new structure