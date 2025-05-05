# Core Packages

## Overview
This directory contains the core packages of the application, following a clean architecture approach. Each package has a specific responsibility and is designed to be independent of the others as much as possible.

## Packages

### Domain
The domain package contains the core business logic, entities, and business rules of the application. It represents the heart of the system and is independent of any external frameworks or technologies.

#### Structure
```
domain/
├── src/
│   ├── [name]/           # Template directory for new domain contexts
│   │   ├── aggregates/   # Aggregate roots that maintain consistency boundaries
│   │   ├── entities/     # Domain entities with identity and lifecycle
│   │   ├── events/       # Domain events that represent state changes
│   │   ├── repositories/ # Repository interfaces for data access
│   │   ├── services/     # Domain services for operations that don't belong to entities
│   │   └── value-objects/# Immutable objects without identity
│   ├── user/             # User domain context
│   │   ├── aggregates/   # User-related aggregate roots
│   │   ├── entities/     # User-related entities
│   │   ├── events/       # User-related domain events
│   │   ├── repositories/ # User-related repository interfaces
│   │   ├── services/     # User-related domain services
│   │   └── value-objects/# User-related value objects
│   └── index.ts          # Package entry point
```

For more details, see the [Domain README](./domain/README.md).

### Application
The application package implements use cases and application-specific logic. It orchestrates the flow of data to and from the domain entities and directs them to perform their operations.

#### Structure
```
application/
├── src/
│   ├── [name]/           # Template directory for new application contexts
│   │   ├── commands/     # Command handlers for write operations
│   │   ├── dtos/         # Data Transfer Objects for input/output
│   │   ├── event-handlers/# Handlers for domain events
│   │   ├── handlers/     # Generic handlers
│   │   ├── mappers/      # Mappers between domain entities and DTOs
│   │   ├── queries/      # Query handlers for read operations
│   │   └── validators/   # Input validation logic
│   └── index.ts          # Package entry point
```

### Adapters
The adapters package provides adapters for external services and infrastructure. It implements the interfaces defined by the application layer and connects the application to external systems.

#### Structure
```
adapters/
├── src/
│   ├── auth/             # Authentication adapters
│   ├── cache/            # Caching adapters
│   ├── database/         # Database adapters
│   ├── graphql/          # GraphQL adapters
│   ├── http/             # HTTP adapters
│   ├── logger/           # Logging adapters
│   ├── messaging/        # Messaging adapters
│   ├── storage/          # Storage adapters
│   └── index.ts          # Package entry point
```

### Shared
The shared package contains shared utilities, types, and helpers used across the application. It provides common functionality that can be used by any other package.

#### Structure
```
shared/
├── src/
│   ├── date-time/        # Date and time utilities
│   ├── error/            # Error handling utilities
│   ├── rbac/             # Role-Based Access Control utilities
│   ├── validation/       # Validation utilities
│   └── index.ts          # Package entry point
```

## Best Practices
- Keep packages focused on their specific responsibilities
- Minimize dependencies between packages
- Follow the dependency rule: dependencies should only point inward (domain <- application <- adapters)
- Use interfaces to define contracts between packages
- Write comprehensive tests for each package
- Document the purpose and structure of each package
