import { Program, ProgramSchema } from './program.model';
import { ZodError } from 'zod';

describe('Program Model', () => {
  describe('constructor', () => {
    it('should create a valid Program instance without indications', () => {
      // Arrange
      const programData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Program',
        labelUrl: 'https://example.com/label.pdf',
      };

      // Act
      const program = new Program(programData);

      // Assert
      expect(program).toBeInstanceOf(Program);
      expect(program.id).toBe(programData.id);
      expect(program.name).toBe(programData.name);
      expect(program.labelUrl).toBe(programData.labelUrl);
      expect(program.indications).toBeUndefined();
    });

    it('should create a valid Program instance with indications', () => {
      // Arrange
      const programData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Program',
        labelUrl: 'https://example.com/label.pdf',
        indications: [
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            description: 'Essential hypertension',
            icd10Code: 'I10',
            drugId: '123e4567-e89b-12d3-a456-426614174000',
            sourceText: 'Hypertension',
            mappingConfidence: 0.95,
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174002',
            description: 'Type 2 diabetes mellitus',
            icd10Code: 'E11',
            drugId: '123e4567-e89b-12d3-a456-426614174000',
            sourceText: 'Diabetes',
            mappingConfidence: 0.92,
          },
        ],
      };

      // Act
      const program = new Program(programData);

      // Assert
      expect(program).toBeInstanceOf(Program);
      expect(program.id).toBe(programData.id);
      expect(program.name).toBe(programData.name);
      expect(program.labelUrl).toBe(programData.labelUrl);
      expect(program.indications).toEqual(programData.indications);
      expect(program.indications?.length).toBe(2);
    });

    it('should throw error when creating with invalid data', () => {
      // Arrange
      const invalidData = {
        id: 'not-a-uuid',
        name: '',
        labelUrl: 'not-a-url',
      };

      // Act & Assert
      expect(() => new Program(invalidData)).toThrow(ZodError);
    });

    it('should throw error when creating with invalid indications', () => {
      // Arrange
      const invalidData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Program',
        labelUrl: 'https://example.com/label.pdf',
        indications: [
          {
            id: 'not-a-uuid',
            description: '',
            icd10Code: '',
            drugId: 'not-a-uuid',
            sourceText: 'Hypertension',
            mappingConfidence: 1.5, // Greater than max (1)
          },
        ],
      };

      // Act & Assert
      expect(() => new Program(invalidData)).toThrow(ZodError);
    });
  });

  describe('validate', () => {
    it('should validate a complete program object', () => {
      // Arrange
      const programData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Program',
        labelUrl: 'https://example.com/label.pdf',
        indications: [
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            description: 'Essential hypertension',
            icd10Code: 'I10',
            drugId: '123e4567-e89b-12d3-a456-426614174000',
            sourceText: 'Hypertension',
            mappingConfidence: 0.95,
          },
        ],
      };

      // Act
      const result = Program.validate(programData);

      // Assert
      expect(result).toEqual(programData);
    });

    it('should throw error when validating invalid data', () => {
      // Arrange
      const invalidData = {
        id: 'not-a-uuid',
        name: '',
        labelUrl: 'not-a-url',
      };

      // Act & Assert
      expect(() => Program.validate(invalidData)).toThrow(ZodError);
    });
  });

  describe('validatePartial', () => {
    it('should validate a partial program object', () => {
      // Arrange
      const partialData = {
        name: 'Test Program',
        labelUrl: 'https://example.com/label.pdf',
      };

      // Act
      const result = Program.validatePartial(partialData);

      // Assert
      expect(result).toEqual(partialData);
    });

    it('should validate a partial program object with partial indications', () => {
      // Arrange
      const partialData = {
        name: 'Test Program',
        indications: [
          {
            description: 'Essential hypertension',
            icd10Code: 'I10',
            mappingConfidence: 0.95,
          },
        ],
      };

      // Act & Assert
      expect(() => Program.validatePartial(partialData)).toThrow(ZodError);
      // This should throw because even in a partial program, if indications are provided,
      // they must be complete indication objects
    });

    it('should throw error when validating invalid partial data', () => {
      // Arrange
      const invalidPartialData = {
        name: '',
        labelUrl: 'not-a-url',
      };

      // Act & Assert
      expect(() => Program.validatePartial(invalidPartialData)).toThrow(ZodError);
    });
  });
});