import { Test, TestingModule } from '@nestjs/testing';
import { MapScrapedIndicationUseCase } from './map-scraped-indication.use-case';
import { IndicationMappingServiceInterface } from '../../domain/services/indication-mapping.service.interface';
import { MappingResult, ScrapedIndication } from '../../domain/models/indication-mapping.model';

describe('MapScrapedIndicationUseCase', () => {
  let useCase: MapScrapedIndicationUseCase;
  let indicationMappingService: IndicationMappingServiceInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MapScrapedIndicationUseCase,
        {
          provide: 'IndicationMappingServiceInterface',
          useValue: {
            mapScrapedIndication: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<MapScrapedIndicationUseCase>(MapScrapedIndicationUseCase);
    indicationMappingService = module.get<IndicationMappingServiceInterface>('IndicationMappingServiceInterface');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should map a scraped indication to an ICD-10 code', async () => {
      // Arrange
      const scraped: ScrapedIndication = {
        indication: 'Hypertension',
        description: 'For the treatment of hypertension',
      };

      const expectedResult: MappingResult = {
        sourceText: 'Hypertension',
        icd10Code: 'I10',
        description: 'Essential (primary) hypertension',
        mappingConfidence: 0.95,
      };

      jest.spyOn(indicationMappingService, 'mapScrapedIndication').mockResolvedValue(expectedResult);

      // Act
      const result = await useCase.execute(scraped);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(indicationMappingService.mapScrapedIndication).toHaveBeenCalledWith(scraped);
    });
  });
});
