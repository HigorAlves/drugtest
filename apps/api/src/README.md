# User Module Architecture

This document explains the architecture of the user module following Domain-Driven Design (DDD), Clean Architecture, and Hexagonal Architecture principles.

## Architecture Overview

The application is divided into three main layers:

### Domain Layer

The domain layer contains the business logic and rules of the application. It's independent of any external frameworks or technologies.

- **models/**: Domain models like User
- **repositories/**: Interfaces for repositories (no implementation details)

### Application Layer

The application layer contains the use cases of the application. It orchestrates the flow of data to and from the domain layer.

- **users/**: User-related use cases
  - `find-all-users.use-case.ts`: Use case for finding all users
  - `find-user-by-id.use-case.ts`: Use case for finding a user by ID
  - `create-user.use-case.ts`: Use case for creating a new user
  - `update-user.use-case.ts`: Use case for updating a user
  - `delete-user.use-case.ts`: Use case for deleting a user

### Infrastructure Layer

The infrastructure layer contains adapters that implement the interfaces defined in the domain layer. It's responsible for communicating with external systems.

- **database/**: Database adapters
  - **entities/**: ORM entities
  - **repositories/**: Repository implementations
- **http/**: HTTP adapters
  - **controllers/**: NestJS controllers
  - **dtos/**: Data Transfer Objects
  - **modules/**: NestJS modules
- **security/**: Security adapters
  - **decorators/**: NestJS decorators
  - **guards/**: NestJS guards

## How to Use

### Domain Layer

The domain layer defines the core business logic and rules of the application. It's independent of any external frameworks or technologies.

```typescript
// Domain model
export class User {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  
  // ...
}

// Repository interface
export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByUsername(username: string): Promise<User | undefined>;
  create(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
```

### Application Layer

The application layer contains the use cases of the application. It orchestrates the flow of data to and from the domain layer.

```typescript
// Use case
@Injectable()
export class FindAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
```

### Infrastructure Layer

The infrastructure layer contains adapters that implement the interfaces defined in the domain layer. It's responsible for communicating with external systems.

```typescript
// Repository implementation
@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const userEntities = await this.userRepository.find();
    return userEntities.map(entity => entity.toDomain());
  }
  
  // ...
}

// Controller
@Controller('users')
export class UsersController {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    // ...
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.findAllUsersUseCase.execute();
  }
  
  // ...
}

// Module
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UsersController],
  providers: [
    FindAllUsersUseCase,
    // ...
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [
    FindAllUsersUseCase,
    // ...
    UserRepository,
  ],
})
export class UsersModule {}
```

## Benefits

- **Separation of concerns**: Each layer has a specific responsibility
- **Testability**: The domain and application layers can be tested independently of the infrastructure layer
- **Maintainability**: Changes to one layer don't affect the others
- **Flexibility**: The infrastructure layer can be replaced without affecting the domain and application layers