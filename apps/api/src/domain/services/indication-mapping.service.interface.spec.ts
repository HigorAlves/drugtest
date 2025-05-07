import { IndicationMappingServiceInterface } from './indication-mapping.service.interface';
import { MappingResult, ScrapedIndication } from '../models/indication-mapping.model';

describe('IndicationMappingServiceInterface', () => {
  // Create a mock implementation of the interface
  class MockIndicationMappingService implements IndicationMappingServiceInterface {
    async mapScrapedIndication(scraped: ScrapedIndication): Promise<MappingResult> {
      return new MappingResult({
        description: 'Mocked description',
        icd10Code: 'M00',
        mappingConfidence: 0.9,
        sourceText: scraped.indication,
      });
    }

    async mapMultipleScrapedIndications(scrapedIndications: ScrapedIndication[]): Promise<MappingResult[]> {
      return Promise.all(scrapedIndications.map(indication => this.mapScrapedIndication(indication)));
    }
  }

  let service: IndicationMappingServiceInterface;

  beforeEach(() => {
    service = new MockIndicationMappingService();
  });

  describe('mapScrapedIndication', () => {
    it('should map a scraped indication to a mapping result', async () => {
      // Arrange
      const scrapedIndication = new ScrapedIndication({
        indication: 'Test Indication',
        description: 'Test Description',
      });

      // Act
      const result = await service.mapScrapedIndication(scrapedIndication);

      // Assert
      expect(result).toBeInstanceOf(MappingResult);
      expect(result.sourceText).toBe('Test Indication');
      expect(result.icd10Code).toBe('M00');
      expect(result.description).toBe('Mocked description');
      expect(result.mappingConfidence).toBe(0.9);
    });
  });

  describe('mapMultipleScrapedIndications', () => {
    it('should map multiple scraped indications to mapping results', async () => {
      // Arrange
      const scrapedIndications = [
        new ScrapedIndication({
          indication: 'Indication 1',
          description: 'Description 1',
        }),
        new ScrapedIndication({
          indication: 'Indication 2',
          description: 'Description 2',
        }),
      ];

      // Act
      const results = await service.mapMultipleScrapedIndications(scrapedIndications);

      // Assert
      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(MappingResult);
      expect(results[0].sourceText).toBe('Indication 1');
      expect(results[1]).toBeInstanceOf(MappingResult);
      expect(results[1].sourceText).toBe('Indication 2');
    });

    it('should return an empty array when no indications are provided', async () => {
      // Arrange
      const scrapedIndications: ScrapedIndication[] = [];

      // Act
      const results = await service.mapMultipleScrapedIndications(scrapedIndications);

      // Assert
      expect(results).toHaveLength(0);
      expect(results).toEqual([]);
    });
  });
});