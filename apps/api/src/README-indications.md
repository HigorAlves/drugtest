# Indications Module Architecture

This document explains the architecture of the indications module following Domain-Driven Design (DDD), Clean Architecture, and Hexagonal Architecture principles.

## Architecture Overview

The application is divided into three main layers:

### Domain Layer

The domain layer contains the business logic and rules of the application. It's independent of any external frameworks or technologies.

- **models/**: Domain models like Indication
- **repositories/**: Interfaces for repositories (no implementation details)

### Application Layer

The application layer contains the use cases of the application. It orchestrates the flow of data to and from the domain layer.

- **indications/**: Indication-related use cases
  - `find-all-indications.use-case.ts`: Use case for finding all indications
  - `find-indication-by-id.use-case.ts`: Use case for finding an indication by ID
  - `find-indications-by-drug-id.use-case.ts`: Use case for finding indications by drug ID
  - `create-indication.use-case.ts`: Use case for creating a new indication
  - `update-indication.use-case.ts`: Use case for updating an indication
  - `delete-indication.use-case.ts`: Use case for deleting an indication

### Infrastructure Layer

The infrastructure layer contains adapters that implement the interfaces defined in the domain layer. It's responsible for communicating with external systems.

- **database/**: Database adapters
  - **entities/**: ORM entities
  - **repositories/**: Repository implementations
- **http/**: HTTP adapters
  - **controllers/**: NestJS controllers
  - **dtos/**: Data Transfer Objects
  - **modules/**: NestJS modules

## How to Use

### Domain Layer

The domain layer defines the core business logic and rules of the application. It's independent of any external frameworks or technologies.

```typescript
// Domain model
export class Indication {
  id: string;
  description: string;
  icd10Code: string;
  drugId: string;
  sourceText?: string;
  mappingConfidence?: number;
  
  // ...
}

// Repository interface
export interface IndicationRepository {
  findAll(): Promise<Indication[]>;
  findById(id: string): Promise<Indication | undefined>;
  findByDrugId(drugId: string): Promise<Indication[]>;
  create(indication: Indication): Promise<Indication>;
  update(id: string, indication: Partial<Indication>): Promise<Indication>;
  delete(id: string): Promise<void>;
}
```

### Application Layer

The application layer contains the use cases of the application. It orchestrates the flow of data to and from the domain layer.

```typescript
// Use case
@Injectable()
export class FindAllIndicationsUseCase {
  constructor(private readonly indicationRepository: IndicationRepository) {}

  async execute(): Promise<Indication[]> {
    return this.indicationRepository.findAll();
  }
}
```

### Infrastructure Layer

The infrastructure layer contains adapters that implement the interfaces defined in the domain layer. It's responsible for communicating with external systems.

```typescript
// Repository implementation
@Injectable()
export class IndicationRepositoryImpl implements IndicationRepository {
  constructor(
    @InjectRepository(IndicationEntity)
    private readonly indicationRepository: Repository<IndicationEntity>,
  ) {}

  async findAll(): Promise<Indication[]> {
    const indicationEntities = await this.indicationRepository.find();
    return indicationEntities.map(entity => entity.toDomain());
  }
  
  // ...
}

// Controller
@Controller('indications')
export class IndicationsController {
  constructor(
    private readonly findAllIndicationsUseCase: FindAllIndicationsUseCase,
    // ...
  ) {}

  @Get()
  async findAll(): Promise<Indication[]> {
    return this.findAllIndicationsUseCase.execute();
  }
  
  // ...
}

// Module
@Module({
  imports: [
    TypeOrmModule.forFeature([IndicationEntity]),
  ],
  controllers: [IndicationsController],
  providers: [
    FindAllIndicationsUseCase,
    // ...
    {
      provide: IndicationRepository,
      useClass: IndicationRepositoryImpl,
    },
  ],
  exports: [
    FindAllIndicationsUseCase,
    // ...
    IndicationRepository,
  ],
})
export class IndicationsModule {}
```

## Benefits

- **Separation of concerns**: Each layer has a specific responsibility
- **Testability**: The domain and application layers can be tested independently of the infrastructure layer
- **Maintainability**: Changes to one layer don't affect the others
- **Flexibility**: The infrastructure layer can be replaced without affecting the domain and application layers