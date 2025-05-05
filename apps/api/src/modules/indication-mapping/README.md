# Indication Mapping Module

This module provides functionality to map medical indications to ICD-10 codes using OpenAI's GPT models.

## Features

- Maps medical indications to appropriate ICD-10 codes
- Handles edge cases:
  - Synonyms (e.g., "Hypertension" vs. "High Blood Pressure")
  - Drugs with multiple indications
  - Unmappable conditions
- Provides confidence scores for each mapping
- Standardizes indication descriptions

## Usage

### Configuration

The module requires an OpenAI API key to be set in the environment variables:

```
OPENAI_API_KEY=your_api_key_here
```

### Basic Usage

```typescript
// Inject the service
constructor(private indicationMappingService: IndicationMappingService) {}

// Map a single indication
const result = await this.indicationMappingService.mapIndicationToICD10('Hypertension');
// Result: { description: 'Essential (primary) hypertension', icd10Code: 'I10', mappingConfidence: 0.95, sourceText: 'Hypertension' }

// Map multiple indications
const indications = ['Hypertension', 'Type 2 Diabetes'];
const results = await this.indicationMappingService.mapMultipleIndications(indications);
```

### Integration with Drug Scraping

The module is integrated with the drug scraping functionality. When scraping indications from DailyMed, the indications are automatically mapped to ICD-10 codes:

```typescript
// In DrugsController
@Post(':id/scrape-indications')
async scrapeIndications(@Param('id') id: string): Promise<Indication[]> {
  // Scrape indications from DailyMed
  const scrapedIndications = await extractIndicationsFromDailyMed(drug.labelUrl);

  // Map indications to ICD-10 codes using AI
  const mappedIndications = await this.indicationMappingService.mapMultipleIndications(scrapedIndications);

  // Save each mapped indication to the database
  // ...
}
```

## Response Format

The mapping service returns results in the following format:

```typescript
interface MappingResult {
  description: string;      // Standardized description of the indication
  icd10Code: string;        // ICD-10 code (or 'UNMAPPABLE' if no code can be assigned)
  mappingConfidence: number; // Confidence score between 0 and 1
  sourceText: string;       // Original indication text
}
```

## Error Handling

If the OpenAI API call fails, the service will return a fallback result with:
- The original indication text as the description
- 'UNMAPPABLE' as the ICD-10 code
- 0 as the mapping confidence

## Testing

The module includes tests that can be run with:

```
npm test indication-mapping.service
```

Note: The tests that make actual API calls are skipped by default. To run them, set the OPENAI_API_KEY environment variable and remove the 'skip' from the test cases.