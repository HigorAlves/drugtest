/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EncryptionService } from '@/services/Encryption.service'
import { EncryptedData } from '@/types'
import { EncryptionError } from '@/utils/EncryptionError'
import { FieldEncryptor } from '@/utils/FieldEncryptor'

describe('FieldEncryptor', () => {
	// Mock EncryptionService for testing
	const mockEncrypt = vi.fn((value: string) => ({
		content: `encrypted-${value}`,
		iv: 'mock-iv',
		authTag: 'mock-auth-tag',
	}))

	const mockDecrypt = vi.fn((data: EncryptedData) => {
		// Extract the original value from the mock encrypted content
		const match = (data.content as string).match(/^encrypted-(.*)$/)
		if (match) {
			return match[1]
		}
		throw new Error('Mock decryption failed')
	})

	const mockEncryptionService = {
		encrypt: mockEncrypt,
		decrypt: mockDecrypt,
	} as unknown as EncryptionService

	beforeEach(() => {
		mockEncrypt.mockClear()
		mockDecrypt.mockClear()
	})

	describe('constructor', () => {
		it('should create an instance with valid config', () => {
			const encryptor = new FieldEncryptor(mockEncryptionService, {
				fields: ['email', 'phoneNumber'],
			})
			expect(encryptor).toBeInstanceOf(FieldEncryptor)
		})

		it('should set default throwOnMissingField to false', () => {
			const encryptor = new FieldEncryptor(mockEncryptionService, {
				fields: ['email'],
			})

			// Test by encrypting an object without the specified field
			const result = encryptor.encryptFields({})
			expect(result).toEqual({}) // Should not throw
		})
	})

	describe('encryptFields', () => {
		it('should encrypt specified string fields in an object', () => {
			const encryptor = new FieldEncryptor(mockEncryptionService, {
				fields: ['email', 'phoneNumber'],
			})

			const obj = {
				id: '123',
				name: 'John Doe',
				email: 'john.doe@example.com',
				phoneNumber: '+1234567890',
				address: '123 Main St',
			}

			const result = encryptor.encryptFields(obj)

			// Fields specified in config should be encrypted
			expect(result.email).toEqual({
				content: 'encrypted-john.doe@example.com',
				iv: 'mock-iv',
				authTag: 'mock-auth-tag',
			})

			expect(result.phoneNumber).toEqual({
				content: 'encrypted-+1234567890',
				iv: 'mock-iv',
				authTag: 'mock-auth-tag',
			})

			// Other fields should remain unchanged
			expect(result.id).toBe('123')
			expect(result.name).toBe('John Doe')
			expect(result.address).toBe('123 Main St')

			// Original object should not be modified
			expect(obj.email).toBe('john.doe@example.com')
			expect(obj.phoneNumber).toBe('+1234567890')

			// Encryption service should be called for each field
			expect(mockEncrypt).toHaveBeenCalledTimes(2)
			expect(mockEncrypt).toHaveBeenCalledWith('john.doe@example.com')
			expect(mockEncrypt).toHaveBeenCalledWith('+1234567890')
		})

		it('should throw an error if object is invalid', () => {
			const encryptor = new FieldEncryptor(mockEncryptionService, {
				fields: ['email'],
			})

			// Test with null
			expect(() => {
				encryptor.encryptFields(null as any)
			}).toThrow(EncryptionError)

			// Test with undefined
			expect(() => {
				encryptor.encryptFields(undefined as any)
			}).toThrow(EncryptionError)

			// Test with array
			expect(() => {
				encryptor.encryptFields(['value'] as any)
			}).toThrow(EncryptionError)

			// Test with primitive
			expect(() => {
				encryptor.encryptFields('string' as any)
			}).toThrow(EncryptionError)
		})

		it('should throw an error if a field is missing and throwOnMissingField is true', () => {
			const encryptor = new FieldEncryptor(mockEncryptionService, {
				fields: ['email', 'phoneNumber'],
				throwOnMissingField: true,
			})

			const obj = {
				id: '123',
				email: 'john.doe@example.com',
				// phoneNumber is missing
			}

			expect(() => {
				encryptor.encryptFields(obj)
			}).toThrow(/Field 'phoneNumber' not found/)
		})

		it('should not throw an error if a field is missing and throwOnMissingField is false', () => {
			const encryptor = new FieldEncryptor(mockEncryptionService, {
				fields: ['email', 'phoneNumber'],
				throwOnMissingField: false,
			})

			const obj = {
				id: '123',
				email: 'john.doe@example.com',
				// phoneNumber is missing
			}

			const result = encryptor.encryptFields(obj)

			// Should encrypt existing fields
			expect(result.email).toEqual({
				content: 'encrypted-john.doe@example.com',
				iv: 'mock-iv',
				authTag: 'mock-auth-tag',
			})

			// Should not add missing fields
			expect(result.phoneNumber).toBeUndefined()
		})
	})

	describe('decryptFields', () => {
		it('should decrypt specified fields in an object', () => {
			const encryptor = new FieldEncryptor(mockEncryptionService, {
				fields: ['email', 'phoneNumber'],
			})

			const obj = {
				id: '123',
				name: 'John Doe',
				email: {
					content: 'encrypted-john.doe@example.com',
					iv: 'mock-iv',
					authTag: 'mock-auth-tag',
				},
				phoneNumber: {
					content: 'encrypted-+1234567890',
					iv: 'mock-iv',
					authTag: 'mock-auth-tag',
				},
				address: '123 Main St',
			}

			const result = encryptor.decryptFields(obj)

			// Fields specified in config should be decrypted
			expect(result.email).toBe('john.doe@example.com')
			expect(result.phoneNumber).toBe('+1234567890')

			// Other fields should remain unchanged
			expect(result.id).toBe('123')
			expect(result.name).toBe('John Doe')
			expect(result.address).toBe('123 Main St')

			// Original object should not be modified
			expect(obj.email).toEqual({
				content: 'encrypted-john.doe@example.com',
				iv: 'mock-iv',
				authTag: 'mock-auth-tag',
			})

			// Decryption service should be called for each field
			expect(mockDecrypt).toHaveBeenCalledTimes(2)
		})

		it('should only decrypt fields that are encrypted data objects', () => {
			const encryptor = new FieldEncryptor(mockEncryptionService, {
				fields: ['email', 'plainEmail', 'age'],
			})

			const obj = {
				email: {
					content: 'encrypted-john.doe@example.com',
					iv: 'mock-iv',
					authTag: 'mock-auth-tag',
				},
				plainEmail: 'jane.doe@example.com', // Not encrypted
				age: 30,
			}

			const result = encryptor.decryptFields(obj)

			// Only encrypted data objects should be decrypted
			expect(result.email).toBe('john.doe@example.com')

			// Other fields should remain unchanged
			expect(result.plainEmail).toBe('jane.doe@example.com')
			expect(result.age).toBe(30)

			// Decryption service should be called only for encrypted fields
			expect(mockDecrypt).toHaveBeenCalledTimes(1)
		})

		it('should throw an error if object is invalid', () => {
			const encryptor = new FieldEncryptor(mockEncryptionService, {
				fields: ['email'],
			})

			// Test with null
			expect(() => {
				encryptor.decryptFields(null as any)
			}).toThrow(EncryptionError)

			// Test with undefined
			expect(() => {
				encryptor.decryptFields(undefined as any)
			}).toThrow(EncryptionError)

			// Test with array
			expect(() => {
				encryptor.decryptFields(['value'] as any)
			}).toThrow(EncryptionError)

			// Test with primitive
			expect(() => {
				encryptor.decryptFields('string' as any)
			}).toThrow(EncryptionError)
		})

		it('should throw an error if a field is missing and throwOnMissingField is true', () => {
			const encryptor = new FieldEncryptor(mockEncryptionService, {
				fields: ['email', 'phoneNumber'],
				throwOnMissingField: true,
			})

			const obj = {
				id: '123',
				email: {
					content: 'encrypted-john.doe@example.com',
					iv: 'mock-iv',
					authTag: 'mock-auth-tag',
				},
				// phoneNumber is missing
			}

			expect(() => {
				encryptor.decryptFields(obj)
			}).toThrow(/Field 'phoneNumber' not found/)
		})

		it('should not throw an error if a field is missing and throwOnMissingField is false', () => {
			const encryptor = new FieldEncryptor(mockEncryptionService, {
				fields: ['email', 'phoneNumber'],
				throwOnMissingField: false,
			})

			const obj = {
				id: '123',
				email: {
					content: 'encrypted-john.doe@example.com',
					iv: 'mock-iv',
					authTag: 'mock-auth-tag',
				},
				// phoneNumber is missing
			}

			const result = encryptor.decryptFields(obj)

			// Should decrypt existing fields
			expect(result.email).toBe('john.doe@example.com')

			// Should not add missing fields
			expect(result.phoneNumber).toBeUndefined()
		})

		it('should handle decryption failures based on throwOnMissingField', () => {
			// Mock a decryption failure
			mockDecrypt.mockImplementationOnce(() => {
				throw new Error('Decryption failed')
			})

			// With throwOnMissingField = true
			const strictEncryptor = new FieldEncryptor(mockEncryptionService, {
				fields: ['email'],
				throwOnMissingField: true,
			})

			const obj = {
				email: {
					content: 'will-fail',
					iv: 'mock-iv',
					authTag: 'mock-auth-tag',
				},
			}

			expect(() => {
				strictEncryptor.decryptFields(obj)
			}).toThrow(/Failed to decrypt field/)

			// Reset mock
			mockDecrypt.mockClear()
			mockDecrypt.mockImplementationOnce(() => {
				throw new Error('Decryption failed')
			})

			// With throwOnMissingField = false
			const lenientEncryptor = new FieldEncryptor(mockEncryptionService, {
				fields: ['email'],
				throwOnMissingField: false,
			})

			const result = lenientEncryptor.decryptFields(obj)

			// Should keep the original encrypted value on failure
			expect(result.email).toEqual({
				content: 'will-fail',
				iv: 'mock-iv',
				authTag: 'mock-auth-tag',
			})
		})
	})
})
