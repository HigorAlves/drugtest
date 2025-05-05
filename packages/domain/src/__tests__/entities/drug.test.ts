import { v4 as uuidv4 } from 'uuid'
import { describe, expect, it } from 'vitest'

import { Drug, DrugType } from '@/entities/drug'

describe('Drug Entity', () => {
	const validDrugData: DrugType = {
		id: uuidv4(),
		name: 'Test Drug',
		labelUrl: 'https://example.com/label',
	}

	describe('constructor', () => {
		it('should create a valid Drug instance', () => {
			const drug = new Drug(validDrugData)

			expect(drug).toBeInstanceOf(Drug)
			expect(drug.id).toBe(validDrugData.id)
			expect(drug.name).toBe(validDrugData.name)
			expect(drug.labelUrl).toBe(validDrugData.labelUrl)
		})

		it('should throw an error if id is not a valid UUID', () => {
			const invalidData = {
				...validDrugData,
				id: 'not-a-uuid',
			}

			expect(() => new Drug(invalidData)).toThrow()
		})

		it('should throw an error if name is empty', () => {
			const invalidData = {
				...validDrugData,
				name: '',
			}

			expect(() => new Drug(invalidData)).toThrow()
		})

		it('should throw an error if labelUrl is not a valid URL', () => {
			const invalidData = {
				...validDrugData,
				labelUrl: 'not-a-url',
			}

			expect(() => new Drug(invalidData)).toThrow()
		})
	})

	describe('validate', () => {
		it('should validate a valid drug object', () => {
			const result = Drug.validate(validDrugData)

			expect(result).toEqual(validDrugData)
		})

		it('should throw an error for invalid drug object', () => {
			const invalidData = {
				...validDrugData,
				name: '',
			}

			expect(() => Drug.validate(invalidData)).toThrow()
		})
	})

	describe('validatePartial', () => {
		it('should validate a partial drug object', () => {
			const partialData = {
				name: 'Partial Drug',
			}

			const result = Drug.validatePartial(partialData)

			expect(result).toEqual(partialData)
		})

		it('should throw an error for invalid partial drug object', () => {
			const invalidPartialData = {
				name: '',
			}

			expect(() => Drug.validatePartial(invalidPartialData)).toThrow()
		})
	})
})
