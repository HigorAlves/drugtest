# Drugs Module Architecture

This document explains the architecture of the drugs module following Domain-Driven Design (DDD), Clean Architecture, and Hexagonal Architecture principles.

## Architecture Overview

The application is divided into three main layers:

### Domain Layer

The domain layer contains the business logic and rules of the application. It's independent of any external frameworks or technologies.

- **models/**: Domain models like Drug
- **repositories/**: Interfaces for repositories (no implementation details)

### Application Layer

The application layer contains the use cases of the application. It orchestrates the flow of data to and from the domain layer.

- **drugs/**: Drug-related use cases
  - `find-all-drugs.use-case.ts`: Use case for finding all drugs
  - `find-drug-by-id.use-case.ts`: Use case for finding a drug by ID
  - `create-drug.use-case.ts`: Use case for creating a new drug
  - `update-drug.use-case.ts`: Use case for updating a drug
  - `delete-drug.use-case.ts`: Use case for deleting a drug

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
export class Drug {
  id: string;
  name: string;
  labelUrl: string;
  
  // ...
}

// Repository interface
export interface DrugRepository {
  findAll(): Promise<Drug[]>;
  findById(id: string): Promise<Drug | undefined>;
  create(drug: Drug): Promise<Drug>;
  update(id: string, drug: Partial<Drug>): Promise<Drug>;
  delete(id: string): Promise<void>;
}
```

### Application Layer

The application layer contains the use cases of the application. It orchestrates the flow of data to and from the domain layer.

```typescript
// Use case
@Injectable()
export class FindAllDrugsUseCase {
  constructor(private readonly drugRepository: DrugRepository) {}

  async execute(): Promise<Drug[]> {
    return this.drugRepository.findAll();
  }
}
```

### Infrastructure Layer

The infrastructure layer contains adapters that implement the interfaces defined in the domain layer. It's responsible for communicating with external systems.

```typescript
// Repository implementation
@Injectable()
export class DrugRepositoryImpl implements DrugRepository {
  constructor(
    @InjectRepository(DrugEntity)
    private readonly drugRepository: Repository<DrugEntity>,
  ) {}

  async findAll(): Promise<Drug[]> {
    const drugEntities = await this.drugRepository.find();
    return drugEntities.map(entity => entity.toDomain());
  }
  
  // ...
}

// Controller
@Controller('drugs')
export class DrugsController {
  constructor(
    private readonly findAllDrugsUseCase: FindAllDrugsUseCase,
    // ...
  ) {}

  @Get()
  async findAll(): Promise<Drug[]> {
    return this.findAllDrugsUseCase.execute();
  }
  
  // ...
}

// Module
@Module({
  imports: [
    TypeOrmModule.forFeature([DrugEntity]),
  ],
  controllers: [DrugsController],
  providers: [
    FindAllDrugsUseCase,
    // ...
    {
      provide: DrugRepository,
      useClass: DrugRepositoryImpl,
    },
  ],
  exports: [
    FindAllDrugsUseCase,
    // ...
    DrugRepository,
  ],
})
export class DrugsModule {}
```

## Benefits

- **Separation of concerns**: Each layer has a specific responsibility
- **Testability**: The domain and application layers can be tested independently of the infrastructure layer
- **Maintainability**: Changes to one layer don't affect the others
- **Flexibility**: The infrastructure layer can be replaced without affecting the domain and application layers