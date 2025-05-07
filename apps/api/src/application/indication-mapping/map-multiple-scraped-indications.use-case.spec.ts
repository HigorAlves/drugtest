import { Test, TestingModule } from '@nestjs/testing';
import { MapMultipleScrapedIndicationsUseCase } from './map-multiple-scraped-indications.use-case';
import { IndicationMappingServiceInterface } from '../../domain/services/indication-mapping.service.interface';
import { MappingResult, ScrapedIndication } from '../../domain/models/indication-mapping.model';

describe('MapMultipleScrapedIndicationsUseCase', () => {
  let useCase: MapMultipleScrapedIndicationsUseCase;
  let indicationMappingService: IndicationMappingServiceInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MapMultipleScrapedIndicationsUseCase,
        {
          provide: 'IndicationMappingServiceInterface',
          useValue: {
            mapMultipleScrapedIndications: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<MapMultipleScrapedIndicationsUseCase>(MapMultipleScrapedIndicationsUseCase);
    indicationMappingService = module.get<IndicationMappingServiceInterface>('IndicationMappingServiceInterface');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should map multiple scraped indications to ICD-10 codes', async () => {
      // Arrange
      const scrapedIndications: ScrapedIndication[] = [
        {
          indication: 'Hypertension',
          description: 'For the treatment of hypertension',
        },
        {
          indication: 'Diabetes',
          description: 'For the treatment of type 2 diabetes mellitus',
        },
      ];

      const expectedResults: MappingResult[] = [
        {
          sourceText: 'Hypertension',
          icd10Code: 'I10',
          description: 'Essential (primary) hypertension',
          mappingConfidence: 0.95,
        },
        {
          sourceText: 'Diabetes',
          icd10Code: 'E11',
          description: 'Type 2 diabetes mellitus',
          mappingConfidence: 0.92,
        },
      ];

      jest.spyOn(indicationMappingService, 'mapMultipleScrapedIndications').mockResolvedValue(expectedResults);

      // Act
      const results = await useCase.execute(scrapedIndications);

      // Assert
      expect(results).toEqual(expectedResults);
      expect(indicationMappingService.mapMultipleScrapedIndications).toHaveBeenCalledWith(scrapedIndications);
    });

    it('should return an empty array when no indications are provided', async () => {
      // Arrange
      const scrapedIndications: ScrapedIndication[] = [];
      const expectedResults: MappingResult[] = [];

      jest.spyOn(indicationMappingService, 'mapMultipleScrapedIndications').mockResolvedValue(expectedResults);

      // Act
      const results = await useCase.execute(scrapedIndications);

      // Assert
      expect(results).toEqual(expectedResults);
      expect(indicationMappingService.mapMultipleScrapedIndications).toHaveBeenCalledWith(scrapedIndications);
    });
  });
});
