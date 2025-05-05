# Database Package

## Overview

The database package provides a TypeORM-based database access layer for the application. It includes utilities for
connecting to a PostgreSQL database, managing transactions, and injecting repositories into services. This package is
designed to support open finance applications with entities for users, accounts, transactions, and more.

## Structure

The package is organized as follows:

```
infra/database/
├── src/
│   ├── postgres/
│   │   ├── context/            # Transaction context management
│   │   ├── decorators/         # Decorators for transaction and repository injection
│   │   ├── entity/             # Entity definitions for open finance
│   │   │   ├── account/        # Account-related entities (Account, BankAccount, CreditAccount, etc.)
│   │   │   ├── finance/        # Finance-related entities (Budget, Report, Goal, etc.)
│   │   │   ├── identity/       # Identity-related entities (User, UserAddress, UserEmail, etc.)
│   │   │   ├── transction/     # Transaction-related entities (Transaction, RecurringTransaction, etc.)
│   │   │   ├── investiment/    # Investment-related entities (Investment, InvestmentTransaction, etc.)
│   │   │   ├── exchange/       # Exchange rate entities
│   │   │   ├── external/       # External service entities (Stripe integration, etc.)
│   │   │   └── system/         # System entities (AuditLog, Notification, etc.)
│   │   ├── migration/          # Database migrations
│   │   ├── repository/         # Repository definitions and mappings
│   │   ├── Database.ts         # Main database class
│   │   ├── data-source.ts      # TypeORM data source configuration
│   │   └── index.ts            # Package exports
│   ├── diagrams/               # Database diagrams
│   ├── env.ts                  # Environment configuration
│   └── index.ts                # Main package entry point
```

## Decorators

The package provides several decorators to simplify database operations:

### InjectRepository

This decorator injects a TypeORM repository into a class property. It automatically handles transaction context, ensuring that the repository uses the current transaction if one is active.

#### Usage

```typescript
import { InjectRepository, RepositoryType } from 'infra/database'

class UserService {
	@InjectRepository(RepositoryType.USER)
	private userRepository: Repository<User>

	async findUserById(id: string): Promise<User | null> {
		return this.userRepository.findOneBy({ id })
	}
}
```

### Transactional

This decorator wraps a method in a database transaction. The transaction is automatically committed if the method completes successfully, or rolled back if an error is thrown.

#### Usage

```typescript
import { Transactional } from 'infra/database'

class UserService {
	@InjectRepository(RepositoryType.USER)
	private userRepository: Repository<User>

	@Transactional()
	async createUser(userData: UserData): Promise<User> {
		const user = new User()
		user.name = userData.name
		user.email = userData.email

		return this.userRepository.save(user)
	}
}
```

### TransactionalClass

This decorator makes all methods in a class transactional. It's useful when you want to ensure that all operations in a service are wrapped in transactions without having to add the `@Transactional` decorator to each method.

#### Usage

```typescript
import { TransactionalClass, InjectRepositoryDecorator, RepositoryType } from 'infra/database'

@TransactionalClass()
class UserService {
	@InjectRepository(RepositoryType.USER)
	private userRepository: Repository<User>

	// This method will automatically be wrapped in a transaction
	async createUser(userData: UserData): Promise<User> {
		const user = new User()
		user.name = userData.name
		user.email = userData.email

		return this.userRepository.save(user)
	}

	// This method will also be wrapped in a transaction
	async updateUser(id: string, userData: UserData): Promise<User> {
		const user = await this.userRepository.findOneBy({ id })
		if (!user) {
			throw new Error('User not found')
		}

		user.name = userData.name
		user.email = userData.email

		return this.userRepository.save(user)
	}
}
```

## Transaction Context

The decorators use a transaction context to ensure that all repositories used within a transaction use the same transaction manager. This is handled automatically by the decorators, but it's important to understand how it works:

1. The `@Transactional` and `@TransactionalClass` decorators create a transaction and set the transaction manager in the context.
2. The `@InjectRepository` checks if there's a transaction manager in the context and uses it if available.
3. After the transaction is committed or rolled back, the transaction manager is removed from the context.

This ensures that all database operations within a transactional method use the same transaction, even if they're performed by different repositories or services.

## Configuration

The database connection is configured using environment variables. The following environment variables are required:

```
NODE_ENV=development
TYPEORM_CONNECTION=postgres
TYPEORM_HOST=localhost
TYPEORM_PORT=5432
TYPEORM_USERNAME=dev_local
TYPEORM_PASSWORD=dev_local
TYPEORM_DATABASE=dev_local
```

See the `.env.development` and `.env.test` files for examples of the required variables.

## Database Operations

### Running the Database

To start the database in development mode:

```bash
yarn dev
```

This will start the database with the configuration specified in `.env.development`.

### Migrations

Database migrations are stored in the `src/postgres/migration` directory. They are automatically run when the application starts if the `synchronize` option is set to `true` in the data source configuration.

You can use the TypeORM CLI to manage migrations. The project includes a helper script (`scripts/typeorm.sh`) that
provides a menu-driven interface for common migration operations:

1. **Create a new migration**:

   ```bash
   ./scripts/typeorm.sh
   # Select option 1 and enter the migration name
   ```

2. **Generate a migration based on entity changes**:

   ```bash
   ./scripts/typeorm.sh
   # Select option 2 and enter the migration name
   ```

3. **Run migrations**:

   ```bash
   ./scripts/typeorm.sh
   # Select option 3
   ```

4. **Revert the last migration**:

   ```bash
   ./scripts/typeorm.sh
   # Select option 4
   ```

5. **Show migration status**:

   ```bash
   ./scripts/typeorm.sh
   # Select option 5
   ```

6. **Drop the database schema**:
   ```bash
   ./scripts/typeorm.sh
   # Select option 6
   ```

Alternatively, you can use the TypeORM CLI directly:

```bash
# Create a new migration
yarn typeorm migration:create src/postgres/migration/MyMigration

# Generate a migration based on entity changes
yarn typeorm migration:generate src/postgres/migration/MyMigration

# Run migrations
yarn typeorm migration:run

# Revert the last migration
yarn typeorm migration:revert
```

### Generating Database Diagrams

The package includes a utility to generate UML diagrams of the database schema:

```bash
yarn generate:uml
```

This will generate diagrams in the `src/diagrams` directory.

## Best Practices

### Working with Entities

1. **Use the provided decorators**: Always use the `@InjectRepository` decorator to inject repositories and the
   `@Transactional` or `@TransactionalClass` decorators to manage transactions.

2. **Keep entities focused**: Each entity should represent a single concept in the domain model. Avoid creating entities
   that combine multiple concepts.

3. **Use relationships appropriately**: TypeORM supports various relationship types (one-to-one, one-to-many,
   many-to-many). Choose the appropriate relationship type based on the domain model.

4. **Validate input data**: Always validate input data before saving it to the database. Use zod or a similar validation
   library.

5. **Handle errors gracefully**: Use try-catch blocks to handle database errors and provide meaningful error messages.

### Working with Transactions

1. **Use transactions for operations that modify multiple entities**: Transactions ensure that all operations succeed or
   fail together, maintaining data consistency.

2. **Keep transactions short**: Long-running transactions can lead to performance issues and deadlocks.

3. **Use the appropriate transaction decorator**: Use `@Transactional` for individual methods and `@TransactionalClass`
   for classes where all methods should be transactional.

4. **Be aware of transaction context**: The transaction context is managed automatically by the decorators, but it's
   important to understand how it works to avoid issues.

### Working with Migrations

1. **Always use migrations for schema changes**: Avoid modifying the schema directly in production.

2. **Test migrations before applying them to production**: Run migrations in a test environment first to ensure they
   work as expected.

3. **Include both up and down migrations**: Each migration should include both the changes to apply (up) and how to
   revert them (down).

4. **Keep migrations small and focused**: Each migration should make a small, focused change to the schema.

5. **Document complex migrations**: If a migration is complex, include comments explaining what it does and why.
