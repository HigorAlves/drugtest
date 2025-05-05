# Indication Mapping Module Architecture

This document explains the architecture of the indication mapping module following Domain-Driven Design (DDD), Clean Architecture, and Hexagonal Architecture principles.

## Architecture Overview

The application is divided into three main layers:

### Domain Layer

The domain layer contains the business logic and rules of the application. It's independent of any external frameworks or technologies.

- **models/**: Domain models like ScrapedIndication and MappingResult
- **services/**: Service interfaces like IndicationMappingServiceInterface

### Application Layer

The application layer contains the use cases of the application. It orchestrates the flow of data to and from the domain layer.

- **indication-mapping/**: Indication mapping-related use cases
  - `map-scraped-indication.use-case.ts`: Use case for mapping a scraped indication to an ICD-10 code
  - `map-multiple-scraped-indications.use-case.ts`: Use case for mapping multiple scraped indications to ICD-10 codes

### Infrastructure Layer

The infrastructure layer contains adapters that implement the interfaces defined in the domain layer. It's responsible for communicating with external systems.

- **external/mapping/**: External service adapters
  - `indication-mapping.service.impl.ts`: Implementation of the IndicationMappingServiceInterface using OpenAI
- **http/modules/**: NestJS modules
  - `indication-mapping.module.ts`: Module configuration for indication mapping

## How to Use

### Domain Layer

The domain layer defines the core business logic and rules of the application. It's independent of any external frameworks or technologies.

```typescript
// Domain models
export class ScrapedIndication {
  indication: string;
  description: string;
  
  // ...
}

export class MappingResult {
  description: string;
  icd10Code: string;
  mappingConfidence: number;
  sourceText: string;
  
  // ...
}

// Service interface
export interface IndicationMappingServiceInterface {
  mapScrapedIndication(scraped: ScrapedIndication): Promise<MappingResult>;
  mapMultipleScrapedIndications(scrapedIndications: ScrapedIndication[]): Promise<MappingResult[]>;
}
```

### Application Layer

The application layer contains the use cases of the application. It orchestrates the flow of data to and from the domain layer.

```typescript
// Use case
@Injectable()
export class MapScrapedIndicationUseCase {
  constructor(private readonly indicationMappingService: IndicationMappingServiceInterface) {}

  async execute(scraped: ScrapedIndication): Promise<MappingResult> {
    return this.indicationMappingService.mapScrapedIndication(scraped);
  }
}
```

### Infrastructure Layer

The infrastructure layer contains adapters that implement the interfaces defined in the domain layer. It's responsible for communicating with external systems.

```typescript
// Service implementation
@Injectable()
export class IndicationMappingServiceImpl implements IndicationMappingServiceInterface {
  // ...
  
  async mapScrapedIndication(scraped: ScrapedIndication): Promise<MappingResult> {
    // Implementation using OpenAI
  }
  
  async mapMultipleScrapedIndications(scrapedIndications: ScrapedIndication[]): Promise<MappingResult[]> {
    // Implementation using mapScrapedIndication
  }
}

// Module
@Module({
  imports: [ConfigModule],
  providers: [
    MapScrapedIndicationUseCase,
    MapMultipleScrapedIndicationsUseCase,
    {
      provide: IndicationMappingServiceInterface,
      useClass: IndicationMappingServiceImpl,
    },
  ],
  exports: [
    MapScrapedIndicationUseCase,
    MapMultipleScrapedIndicationsUseCase,
    IndicationMappingServiceInterface,
  ],
})
export class IndicationMappingModule {}
```

## Configuration

The module requires an OpenAI API key to be set in the environment variables:

```
OPENAI_API_KEY=your_api_key_here
```

## Usage

```typescript
// Inject the use case
constructor(
  private readonly mapScrapedIndicationUseCase: MapScrapedIndicationUseCase,
  private readonly mapMultipleScrapedIndicationsUseCase: MapMultipleScrapedIndicationsUseCase,
) {}

// Map a single indication
const scrapedIndication = new ScrapedIndication({
  indication: 'Hypertension',
  description: 'Treatment of high blood pressure',
});
const result = await this.mapScrapedIndicationUseCase.execute(scrapedIndication);
// Result: { description: 'Essential (primary) hypertension', icd10Code: 'I10', mappingConfidence: 0.95, sourceText: 'Hypertension - Treatment of high blood pressure' }

// Map multiple indications
const scrapedIndications = [
  new ScrapedIndication({
    indication: 'Hypertension',
    description: 'Treatment of high blood pressure',
  }),
  new ScrapedIndication({
    indication: 'Type 2 Diabetes',
    description: 'Management of type 2 diabetes mellitus',
  }),
];
const results = await this.mapMultipleScrapedIndicationsUseCase.execute(scrapedIndications);
```

## Error Handling

If the OpenAI API call fails, the service will return a fallback result with:
- The original indication text as the description
- 'UNMAPPABLE' as the ICD-10 code
- 0 as the mapping confidence

## Benefits

- **Separation of concerns**: Each layer has a specific responsibility
- **Testability**: The domain and application layers can be tested independently of the infrastructure layer
- **Maintainability**: Changes to one layer don't affect the others
- **Flexibility**: The infrastructure layer can be replaced without affecting the domain and application layers