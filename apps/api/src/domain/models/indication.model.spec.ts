import { Indication, IndicationSchema } from './indication.model';
import { ZodError } from 'zod';

describe('Indication Model', () => {
  describe('constructor', () => {
    it('should create a valid Indication instance', () => {
      // Arrange
      const indicationData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Essential hypertension',
        icd10Code: 'I10',
        drugId: '123e4567-e89b-12d3-a456-426614174001',
        sourceText: 'Hypertension',
        mappingConfidence: 0.95,
      };

      // Act
      const indication = new Indication(indicationData);

      // Assert
      expect(indication).toBeInstanceOf(Indication);
      expect(indication.id).toBe(indicationData.id);
      expect(indication.description).toBe(indicationData.description);
      expect(indication.icd10Code).toBe(indicationData.icd10Code);
      expect(indication.drugId).toBe(indicationData.drugId);
      expect(indication.sourceText).toBe(indicationData.sourceText);
      expect(indication.mappingConfidence).toBe(indicationData.mappingConfidence);
    });

    it('should throw error when creating with invalid data', () => {
      // Arrange
      const invalidData = {
        id: 'not-a-uuid',
        description: '',
        icd10Code: '',
        drugId: 'not-a-uuid',
        sourceText: 'Hypertension',
        mappingConfidence: 1.5, // Greater than max (1)
      };

      // Act & Assert
      expect(() => new Indication(invalidData)).toThrow(ZodError);
    });
  });

  describe('validate', () => {
    it('should validate a complete indication object', () => {
      // Arrange
      const indicationData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Essential hypertension',
        icd10Code: 'I10',
        drugId: '123e4567-e89b-12d3-a456-426614174001',
        sourceText: 'Hypertension',
        mappingConfidence: 0.95,
      };

      // Act
      const result = Indication.validate(indicationData);

      // Assert
      expect(result).toEqual(indicationData);
    });

    it('should throw error when validating invalid data', () => {
      // Arrange
      const invalidData = {
        id: 'not-a-uuid',
        description: '',
        icd10Code: '',
        drugId: 'not-a-uuid',
        sourceText: 'Hypertension',
        mappingConfidence: -0.1, // Less than min (0)
      };

      // Act & Assert
      expect(() => Indication.validate(invalidData)).toThrow(ZodError);
    });
  });

  describe('validatePartial', () => {
    it('should validate a partial indication object', () => {
      // Arrange
      const partialData = {
        description: 'Essential hypertension',
        icd10Code: 'I10',
        mappingConfidence: 0.8,
      };

      // Act
      const result = Indication.validatePartial(partialData);

      // Assert
      expect(result).toEqual(partialData);
    });

    it('should throw error when validating invalid partial data', () => {
      // Arrange
      const invalidPartialData = {
        description: '',
        icd10Code: '',
        mappingConfidence: 2, // Greater than max (1)
      };

      // Act & Assert
      expect(() => Indication.validatePartial(invalidPartialData)).toThrow(ZodError);
    });
  });
});