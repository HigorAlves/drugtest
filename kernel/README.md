# Kernel

## Overview

The Kernel is a foundational layer in our hexagonal architecture that provides core system components used across the entire application. These components are essential building blocks that support the implementation of the domain, application, and adapter layers.

## Hexagonal Architecture

Hexagonal Architecture (also known as Ports and Adapters pattern) is a software design pattern that allows an application to be equally driven by users, programs, automated tests, or batch scripts, and to be developed and tested in isolation from its eventual run-time devices and databases.

The key principles of hexagonal architecture include:

1. **Separation of Concerns**: Clear boundaries between business logic and external systems
2. **Domain-Centric**: Business logic is at the center, with external concerns at the periphery
3. **Dependency Rule**: Dependencies point inward, with the domain having no dependencies on external layers
4. **Ports and Adapters**: Interfaces (ports) define how the application interacts with the outside world, while adapters implement these interfaces

In our implementation:

- **Domain Layer**: Contains business entities and rules
- **Application Layer**: Contains use cases and application-specific logic
- **Adapters Layer**: Provides implementations for external services and infrastructure
- **Kernel**: Provides core system components used across all layers

## Kernel Components

### Error Package

The Error package provides standardized error handling across the application. It includes:

- **EnterpriseError**: Base error class that extends the standard Error class with additional context:

  - `package`: Identifies which package the error originated from
  - `meta`: Stores additional metadata about the error

- **ValidationError**: Specialized error for validation failures, with specific handling for Zod schema validation errors

- **DatabaseError**: Specialized error for database operations, with formatting for PostgreSQL error codes and details

These error classes enable consistent error reporting, handling, and logging throughout the application, making debugging and error resolution more efficient.

### Logger Package

The Logger package provides a standardized logging solution across the application. It includes:

- **createLogger**: Factory function for creating Winston logger instances with:

  - Environment-specific configurations (production, staging, development)
  - Integration with Grafana Loki for log aggregation
  - File rotation for persistent logs
  - Custom formatting for improved readability

- **InjectLogger**: Decorator for easily injecting logger instances into classes:

  ```typescript
  class MyService {
    @InjectLogger()
    private logger: Logger;

    public doSomething() {
      this.logger.info("Doing something");
    }
  }
  ```

### Encryption Package

The Encryption package provides standardized encryption and decryption functionality for sensitive data across the application. It is designed to help meet privacy regulations such as LGPD (Brazil), GDPR (Europe), and CCPA (US) by providing secure encryption for sensitive personal data. It includes:

- **EncryptionService**: Core service for encrypting and decrypting sensitive data:

  - Uses AES-256-GCM, an authenticated encryption algorithm
  - Provides both confidentiality and integrity for encrypted data
  - Handles encryption key management and initialization vectors

- **FieldEncryptor**: Utility for encrypting and decrypting specific fields in objects:

  - Selectively encrypts only the specified fields
  - Preserves the structure of the original object
  - Configurable to handle missing fields gracefully

- **Encrypt Decorator**: Property decorator for marking fields for encryption:
  - Declarative approach to specifying which fields should be encrypted
  - Works with TypeScript's decorator metadata
  - Provides helper functions for encrypting and decrypting marked fields

### Feature Flags Package

The Feature Flags package provides a standardized way to implement feature flags (also known as feature toggles) across
the application. It enables controlled feature rollout, A/B testing, and environment-specific feature availability. It
includes:

- **FeatureFlagService**: Core service for managing and evaluating feature flags:

  - Caching mechanism for improved performance
  - Environment-aware flag evaluation
  - Type-safe flag values (boolean, string, number, JSON)
  - Context-based flag evaluation for targeted features

- **FeatureFlagProvider**: Interface for different feature flag storage implementations:

  - Allows for different backends (in-memory, database, remote API)
  - Consistent API regardless of storage mechanism
  - Extensible for custom provider implementations

- **UseFeatureFlagDecorator**: Decorator for easily injecting the feature flag service into classes:

  ```typescript
  class MyService {
    @UseFeatureFlagDecorator()
    private featureFlags: FeatureFlagService;

    public async doSomething() {
      if (await this.featureFlags.isEnabled("new-feature")) {
        // New feature implementation
      } else {
        // Old implementation
      }
    }
  }
  ```

## Integration with Other Layers

The Kernel components are designed to be used across all layers of the application:

- **Domain Layer**: Uses error classes for domain-specific validation and business rule violations; uses encryption for
  protecting sensitive domain entity fields; uses feature flags for toggling domain-level behaviors
- **Application Layer**: Uses both error handling and logging for use case execution and application flow; uses
  encryption services to secure sensitive data during processing; uses feature flags to control application-level
  features and flows
- **Adapters Layer**: Uses specialized errors like DatabaseError for external service integration issues and logging for
  monitoring external interactions; uses encryption/decryption for secure data storage and transmission; uses feature
  flags to control adapter-specific implementations and integrations

By providing these core components, the Kernel ensures consistency across the application while allowing each layer to focus on its specific responsibilities within the hexagonal architecture.
