import { ScrapedIndication, MappingResult, ScrapedIndicationSchema, MappingResultSchema } from './indication-mapping.model';
import { ZodError } from 'zod';

describe('IndicationMapping Models', () => {
  describe('ScrapedIndication', () => {
    describe('constructor', () => {
      it('should create a valid ScrapedIndication instance', () => {
        // Arrange
        const scrapedData = {
          indication: 'Hypertension',
          description: 'For the treatment of hypertension',
        };

        // Act
        const scrapedIndication = new ScrapedIndication(scrapedData);

        // Assert
        expect(scrapedIndication).toBeInstanceOf(ScrapedIndication);
        expect(scrapedIndication.indication).toBe(scrapedData.indication);
        expect(scrapedIndication.description).toBe(scrapedData.description);
      });

      it('should throw error when creating with invalid data', () => {
        // Arrange
        const invalidData = {
          indication: '',
          description: '',
        };

        // Act & Assert
        expect(() => new ScrapedIndication(invalidData)).toThrow(ZodError);
      });
    });

    describe('validate', () => {
      it('should validate a complete scraped indication object', () => {
        // Arrange
        const scrapedData = {
          indication: 'Hypertension',
          description: 'For the treatment of hypertension',
        };

        // Act
        const result = ScrapedIndication.validate(scrapedData);

        // Assert
        expect(result).toEqual(scrapedData);
      });

      it('should throw error when validating invalid data', () => {
        // Arrange
        const invalidData = {
          indication: '',
          description: '',
        };

        // Act & Assert
        expect(() => ScrapedIndication.validate(invalidData)).toThrow(ZodError);
      });
    });

    describe('validatePartial', () => {
      it('should validate a partial scraped indication object', () => {
        // Arrange
        const partialData = {
          indication: 'Hypertension',
        };

        // Act
        const result = ScrapedIndication.validatePartial(partialData);

        // Assert
        expect(result).toEqual(partialData);
      });

      it('should throw error when validating invalid partial data', () => {
        // Arrange
        const invalidPartialData = {
          indication: '',
        };

        // Act & Assert
        expect(() => ScrapedIndication.validatePartial(invalidPartialData)).toThrow(ZodError);
      });
    });
  });

  describe('MappingResult', () => {
    describe('constructor', () => {
      it('should create a valid MappingResult instance', () => {
        // Arrange
        const mappingData = {
          description: 'Essential hypertension',
          icd10Code: 'I10',
          mappingConfidence: 0.95,
          sourceText: 'Hypertension',
        };

        // Act
        const mappingResult = new MappingResult(mappingData);

        // Assert
        expect(mappingResult).toBeInstanceOf(MappingResult);
        expect(mappingResult.description).toBe(mappingData.description);
        expect(mappingResult.icd10Code).toBe(mappingData.icd10Code);
        expect(mappingResult.mappingConfidence).toBe(mappingData.mappingConfidence);
        expect(mappingResult.sourceText).toBe(mappingData.sourceText);
      });

      it('should throw error when creating with invalid data', () => {
        // Arrange
        const invalidData = {
          description: '',
          icd10Code: '',
          mappingConfidence: 1.5, // Greater than max (1)
          sourceText: '',
        };

        // Act & Assert
        expect(() => new MappingResult(invalidData)).toThrow(ZodError);
      });
    });

    describe('validate', () => {
      it('should validate a complete mapping result object', () => {
        // Arrange
        const mappingData = {
          description: 'Essential hypertension',
          icd10Code: 'I10',
          mappingConfidence: 0.95,
          sourceText: 'Hypertension',
        };

        // Act
        const result = MappingResult.validate(mappingData);

        // Assert
        expect(result).toEqual(mappingData);
      });

      it('should throw error when validating invalid data', () => {
        // Arrange
        const invalidData = {
          description: '',
          icd10Code: '',
          mappingConfidence: -0.1, // Less than min (0)
          sourceText: '',
        };

        // Act & Assert
        expect(() => MappingResult.validate(invalidData)).toThrow(ZodError);
      });
    });

    describe('validatePartial', () => {
      it('should validate a partial mapping result object', () => {
        // Arrange
        const partialData = {
          description: 'Essential hypertension',
          icd10Code: 'I10',
        };

        // Act
        const result = MappingResult.validatePartial(partialData);

        // Assert
        expect(result).toEqual(partialData);
      });

      it('should throw error when validating invalid partial data', () => {
        // Arrange
        const invalidPartialData = {
          description: '',
          icd10Code: '',
        };

        // Act & Assert
        expect(() => MappingResult.validatePartial(invalidPartialData)).toThrow(ZodError);
      });
    });
  });
});