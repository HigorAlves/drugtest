# Auth Module Architecture

This document explains the architecture of the auth module following Domain-Driven Design (DDD), Clean Architecture, and Hexagonal Architecture principles.

## Architecture Overview

The application is divided into three main layers:

### Domain Layer

The domain layer contains the business logic and rules of the application. It's independent of any external frameworks or technologies.

- **models/**: Domain models like JwtPayload
- **repositories/**: Interfaces for repositories (no implementation details)

### Application Layer

The application layer contains the use cases of the application. It orchestrates the flow of data to and from the domain layer.

- **auth/**: Auth-related use cases
  - `validate-user.use-case.ts`: Use case for validating a user's credentials
  - `login.use-case.ts`: Use case for logging in a user
  - `register-user.use-case.ts`: Use case for registering a new user

### Infrastructure Layer

The infrastructure layer contains adapters that implement the interfaces defined in the domain layer. It's responsible for communicating with external systems.

- **http/**: HTTP adapters
  - **controllers/**: NestJS controllers
  - **dtos/**: Data Transfer Objects
  - **modules/**: NestJS modules
- **security/**: Security adapters
  - **decorators/**: NestJS decorators
  - **guards/**: NestJS guards
  - **strategies/**: Authentication strategies

## How to Use

### Domain Layer

The domain layer defines the core business logic and rules of the application. It's independent of any external frameworks or technologies.

```typescript
// Domain model
export interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
}
```

### Application Layer

The application layer contains the use cases of the application. It orchestrates the flow of data to and from the domain layer.

```typescript
// Use case
@Injectable()
export class ValidateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(username: string, password: string): Promise<Omit<User, 'passwordHash'> | null> {
    // Find user by username
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      return null;
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    // Return user without password hash
    const { passwordHash, ...result } = user;
    return result;
  }
}
```

### Infrastructure Layer

The infrastructure layer contains adapters that implement the interfaces defined in the domain layer. It's responsible for communicating with external systems.

```typescript
// Controller
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase
  ) {}

  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.loginUseCase.execute(req.user);
  }
  
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.registerUserUseCase.execute(registerDto.username, registerDto.password);
  }
}

// Module
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') || '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    ValidateUserUseCase,
    LoginUseCase,
    RegisterUserUseCase,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [
    ValidateUserUseCase,
    LoginUseCase,
    RegisterUserUseCase,
  ],
})
export class AuthModule {}
```

## Benefits

- **Separation of concerns**: Each layer has a specific responsibility
- **Testability**: The domain and application layers can be tested independently of the infrastructure layer
- **Maintainability**: Changes to one layer don't affect the others
- **Flexibility**: The infrastructure layer can be replaced without affecting the domain and application layers