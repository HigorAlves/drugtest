# Programs Module Architecture

This document explains the architecture of the programs module following Domain-Driven Design (DDD), Clean Architecture, and Hexagonal Architecture principles.

## Architecture Overview

The application is divided into three main layers:

### Domain Layer

The domain layer contains the business logic and rules of the application. It's independent of any external frameworks or technologies.

- **models/**: Domain models like Program
- **repositories/**: Interfaces for repositories (no implementation details)

### Application Layer

The application layer contains the use cases of the application. It orchestrates the flow of data to and from the domain layer.

- **programs/**: Program-related use cases
  - `find-program-by-id.use-case.ts`: Use case for finding a program by ID

### Infrastructure Layer

The infrastructure layer contains adapters that implement the interfaces defined in the domain layer. It's responsible for communicating with external systems.

- **database/**: Database adapters
  - **repositories/**: Repository implementations
- **http/**: HTTP adapters
  - **controllers/**: NestJS controllers
  - **modules/**: NestJS modules

## How to Use

### Domain Layer

The domain layer defines the core business logic and rules of the application. It's independent of any external frameworks or technologies.

```typescript
// Domain model
export class Program {
  id: string;
  name: string;
  labelUrl: string;
  indications?: Indication[];
  
  // ...
}

// Repository interface
export interface ProgramRepository {
  findById(id: string): Promise<Program | undefined>;
}
```

### Application Layer

The application layer contains the use cases of the application. It orchestrates the flow of data to and from the domain layer.

```typescript
// Use case
@Injectable()
export class FindProgramByIdUseCase {
  constructor(private readonly programRepository: ProgramRepository) {}

  async execute(id: string): Promise<Program> {
    const program = await this.programRepository.findById(id);
    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
    return program;
  }
}
```

### Infrastructure Layer

The infrastructure layer contains adapters that implement the interfaces defined in the domain layer. It's responsible for communicating with external systems.

```typescript
// Repository implementation
@Injectable()
export class ProgramRepositoryImpl implements ProgramRepository {
  constructor(
    private readonly drugRepository: DrugRepository,
    private readonly indicationRepository: IndicationRepository
  ) {}

  async findById(id: string): Promise<Program | undefined> {
    // Get the drug
    const drug = await this.drugRepository.findById(id);
    if (!drug) {
      return undefined;
    }

    // Get the indications for the drug
    const indications = await this.indicationRepository.findByDrugId(id);

    // Return the program
    return new Program({
      id: drug.id,
      name: drug.name,
      labelUrl: drug.labelUrl,
      indications,
    });
  }
}

// Controller
@Controller('programs')
export class ProgramsController {
  constructor(private readonly findProgramByIdUseCase: FindProgramByIdUseCase) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Program> {
    return this.findProgramByIdUseCase.execute(id);
  }
}

// Module
@Module({
  imports: [DrugsModule, IndicationsModule],
  controllers: [ProgramsController],
  providers: [
    FindProgramByIdUseCase,
    {
      provide: ProgramRepository,
      useClass: ProgramRepositoryImpl,
    },
  ],
  exports: [
    FindProgramByIdUseCase,
    ProgramRepository,
  ],
})
export class ProgramsModule {}
```

## Benefits

- **Separation of concerns**: Each layer has a specific responsibility
- **Testability**: The domain and application layers can be tested independently of the infrastructure layer
- **Maintainability**: Changes to one layer don't affect the others
- **Flexibility**: The infrastructure layer can be replaced without affecting the domain and application layers