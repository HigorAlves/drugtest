import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IndicationMappingService } from './indication-mapping.service';

describe('IndicationMappingService', () => {
  let service: IndicationMappingService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [IndicationMappingService],
    }).compile();

    service = module.get<IndicationMappingService>(IndicationMappingService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // This test is skipped by default as it requires an OpenAI API key
  // To run it, set the OPENAI_API_KEY environment variable and remove the 'skip'
  it.skip('should map an indication to an ICD-10 code', async () => {
    // Check if API key is available
    const apiKey = configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      console.warn('Skipping test: OPENAI_API_KEY not found in environment variables');
      return;
    }

    const result = await service.mapIndicationToICD10('Hypertension');
    
    expect(result).toBeDefined();
    expect(result.description).toBeDefined();
    expect(result.icd10Code).toBeDefined();
    expect(result.mappingConfidence).toBeGreaterThan(0);
    expect(result.sourceText).toBe('Hypertension');
    
    // The exact ICD-10 code for hypertension should be I10
    expect(result.icd10Code).toBe('I10');
  });

  // Test handling of synonyms
  it.skip('should map synonyms to the same ICD-10 code', async () => {
    // Check if API key is available
    const apiKey = configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      console.warn('Skipping test: OPENAI_API_KEY not found in environment variables');
      return;
    }

    const result1 = await service.mapIndicationToICD10('Hypertension');
    const result2 = await service.mapIndicationToICD10('High Blood Pressure');
    
    expect(result1.icd10Code).toBe(result2.icd10Code);
  });

  // Test handling of unmappable conditions
  it.skip('should handle unmappable conditions', async () => {
    // Check if API key is available
    const apiKey = configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      console.warn('Skipping test: OPENAI_API_KEY not found in environment variables');
      return;
    }

    const result = await service.mapIndicationToICD10('This is not a valid medical condition');
    
    expect(result.icd10Code).toBe('UNMAPPABLE');
    expect(result.mappingConfidence).toBeLessThan(0.5);
  });

  // Test mapping multiple indications
  it.skip('should map multiple indications', async () => {
    // Check if API key is available
    const apiKey = configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      console.warn('Skipping test: OPENAI_API_KEY not found in environment variables');
      return;
    }

    const indications = [
      'Hypertension',
      'Type 2 Diabetes',
      'Chronic Kidney Disease'
    ];
    
    const results = await service.mapMultipleIndications(indications);
    
    expect(results).toHaveLength(3);
    expect(results[0].sourceText).toBe('Hypertension');
    expect(results[1].sourceText).toBe('Type 2 Diabetes');
    expect(results[2].sourceText).toBe('Chronic Kidney Disease');
    
    // Check that each result has an ICD-10 code
    results.forEach(result => {
      expect(result.icd10Code).toBeDefined();
      expect(result.description).toBeDefined();
      expect(result.mappingConfidence).toBeGreaterThanOrEqual(0);
      expect(result.mappingConfidence).toBeLessThanOrEqual(1);
    });
  });
});