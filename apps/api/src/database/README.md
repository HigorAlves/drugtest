# Database Module

This module provides TypeORM integration for the API, using the existing infra/database package.

## Setup

1. Make sure you have PostgreSQL installed and running
2. Update the `.env` file with your database connection details:

```
# Database Configuration
NODE_ENV=development
TYPEORM_CONNECTION=postgres
TYPEORM_HOST=localhost
TYPEORM_PORT=5432
TYPEORM_USERNAME=postgres
TYPEORM_PASSWORD=postgres
TYPEORM_DATABASE=drugtest
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=true
```

## Usage

### Importing the DatabaseModule

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  // ...
})
export class YourModule {}
```

### Injecting Repositories

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { USER_REPOSITORY } from '../database/constants';
import { UserEntity } from '../database/entity';

@Injectable()
export class YourService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: Repository<UserEntity>
  ) {}

  // Use the repository...
}
```

## Entities

The module provides the following entities:

- `UserEntity`: Maps to the `User` domain entity
- `DrugEntity`: Maps to the `Drug` domain entity
- `IndicationEntity`: Maps to the `Indication` domain entity

Each entity has methods to convert between the domain entity and the TypeORM entity:

- `static fromDomain(domainEntity)`: Converts a domain entity to a TypeORM entity
- `toDomain()`: Converts a TypeORM entity to a domain entity