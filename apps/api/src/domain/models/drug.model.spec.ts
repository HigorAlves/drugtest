import { Drug, DrugSchema } from './drug.model';
import { ZodError } from 'zod';

describe('Drug Model', () => {
  describe('constructor', () => {
    it('should create a valid Drug instance', () => {
      // Arrange
      const drugData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Drug',
        labelUrl: 'https://example.com/drug-label.pdf',
      };

      // Act
      const drug = new Drug(drugData);

      // Assert
      expect(drug).toBeInstanceOf(Drug);
      expect(drug.id).toBe(drugData.id);
      expect(drug.name).toBe(drugData.name);
      expect(drug.labelUrl).toBe(drugData.labelUrl);
    });

    it('should throw error when creating with invalid data', () => {
      // Arrange
      const invalidData = {
        id: 'not-a-uuid',
        name: '',
        labelUrl: 'not-a-url',
      };

      // Act & Assert
      expect(() => new Drug(invalidData)).toThrow(ZodError);
    });
  });

  describe('validate', () => {
    it('should validate a complete drug object', () => {
      // Arrange
      const drugData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Drug',
        labelUrl: 'https://example.com/drug-label.pdf',
      };

      // Act
      const result = Drug.validate(drugData);

      // Assert
      expect(result).toEqual(drugData);
    });

    it('should throw error when validating invalid data', () => {
      // Arrange
      const invalidData = {
        id: 'not-a-uuid',
        name: '',
        labelUrl: 'not-a-url',
      };

      // Act & Assert
      expect(() => Drug.validate(invalidData)).toThrow(ZodError);
    });
  });

  describe('validatePartial', () => {
    it('should validate a partial drug object', () => {
      // Arrange
      const partialData = {
        name: 'Test Drug',
      };

      // Act
      const result = Drug.validatePartial(partialData);

      // Assert
      expect(result).toEqual(partialData);
    });

    it('should throw error when validating invalid partial data', () => {
      // Arrange
      const invalidPartialData = {
        name: '',
        labelUrl: 'not-a-url',
      };

      // Act & Assert
      expect(() => Drug.validatePartial(invalidPartialData)).toThrow(ZodError);
    });
  });
});