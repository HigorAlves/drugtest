import { v4 as uuidv4 } from 'uuid'
import { describe, expect, it } from 'vitest'

import { Indication, IndicationType } from '@/entities/indication'

describe('Indication Entity', () => {
	const validIndicationData: IndicationType = {
		id: uuidv4(),
		description: 'Test Indication',
		icd10Code: 'A00.0',
		drugId: uuidv4(),
		sourceText: 'Original text from label',
		mappingConfidence: 0.95,
	}

	describe('constructor', () => {
		it('should create a valid Indication instance', () => {
			const indication = new Indication(validIndicationData)

			expect(indication).toBeInstanceOf(Indication)
			expect(indication.id).toBe(validIndicationData.id)
			expect(indication.description).toBe(validIndicationData.description)
			expect(indication.icd10Code).toBe(validIndicationData.icd10Code)
			expect(indication.drugId).toBe(validIndicationData.drugId)
			expect(indication.sourceText).toBe(validIndicationData.sourceText)
			expect(indication.mappingConfidence).toBe(validIndicationData.mappingConfidence)
		})

		it('should create a valid Indication instance without optional fields', () => {
			const minimalData = {
				id: uuidv4(),
				description: 'Test Indication',
				icd10Code: 'A00.0',
				drugId: uuidv4(),
			}

			const indication = new Indication(minimalData)

			expect(indication).toBeInstanceOf(Indication)
			expect(indication.id).toBe(minimalData.id)
			expect(indication.description).toBe(minimalData.description)
			expect(indication.icd10Code).toBe(minimalData.icd10Code)
			expect(indication.drugId).toBe(minimalData.drugId)
			expect(indication.sourceText).toBeUndefined()
			expect(indication.mappingConfidence).toBeUndefined()
		})

		it('should throw an error if id is not a valid UUID', () => {
			const invalidData = {
				...validIndicationData,
				id: 'not-a-uuid',
			}

			expect(() => new Indication(invalidData)).toThrow()
		})

		it('should throw an error if description is empty', () => {
			const invalidData = {
				...validIndicationData,
				description: '',
			}

			expect(() => new Indication(invalidData)).toThrow()
		})

		it('should throw an error if icd10Code is empty', () => {
			const invalidData = {
				...validIndicationData,
				icd10Code: '',
			}

			expect(() => new Indication(invalidData)).toThrow()
		})

		it('should throw an error if drugId is not a valid UUID', () => {
			const invalidData = {
				...validIndicationData,
				drugId: 'not-a-uuid',
			}

			expect(() => new Indication(invalidData)).toThrow()
		})

		it('should throw an error if mappingConfidence is out of range', () => {
			const invalidData = {
				...validIndicationData,
				mappingConfidence: 1.5,
			}

			expect(() => new Indication(invalidData)).toThrow()
		})
	})

	describe('validate', () => {
		it('should validate a valid indication object', () => {
			const result = Indication.validate(validIndicationData)

			expect(result).toEqual(validIndicationData)
		})

		it('should throw an error for invalid indication object', () => {
			const invalidData = {
				...validIndicationData,
				description: '',
			}

			expect(() => Indication.validate(invalidData)).toThrow()
		})
	})

	describe('validatePartial', () => {
		it('should validate a partial indication object', () => {
			const partialData = {
				description: 'Partial Indication',
				icd10Code: 'B01.1',
			}

			const result = Indication.validatePartial(partialData)

			expect(result).toEqual(partialData)
		})

		it('should throw an error for invalid partial indication object', () => {
			const invalidPartialData = {
				description: '',
				mappingConfidence: 2.0,
			}

			expect(() => Indication.validatePartial(invalidPartialData)).toThrow()
		})
	})
})
