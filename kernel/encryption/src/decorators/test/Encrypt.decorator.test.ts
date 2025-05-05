/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	createFieldEncryptors,
	decryptMarkedFields,
	Encrypt,
	encryptMarkedFields,
	getEncryptedFields,
} from '@/decorators/Encrypt.decorator'
import { EncryptionService } from '@/services/Encryption.service'
import { FieldEncryptor } from '@/utils/FieldEncryptor'

describe('EncryptDecorator', () => {
	// Mock EncryptionService for testing
	const mockEncryptionService = {
		encrypt: vi.fn((value: string) => ({
			content: `encrypted-${value}`,
			iv: 'mock-iv',
			authTag: 'mock-auth-tag',
		})),
		decrypt: vi.fn((data: any) => {
			const match = (data.content as string).match(/^encrypted-(.*)$/)
			if (match) {
				return match[1]
			}
			throw new Error('Mock decryption failed')
		}),
	} as unknown as EncryptionService

	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('Encrypt decorator', () => {
		it('should store metadata for a single field', () => {
			// Define a class with a decorated property
			class TestClass {
				@Encrypt('email')
				contactInfo: any
			}

			// Get the metadata
			const metadata = getEncryptedFields(TestClass)

			// Verify the metadata
			expect(metadata).toBeInstanceOf(Map)
			expect(metadata.size).toBe(1)
			expect(metadata.has('contactInfo')).toBe(true)
			expect(metadata.get('contactInfo')).toEqual(['email'])
		})

		it('should store metadata for multiple fields', () => {
			// Define a class with a decorated property
			class TestClass {
				@Encrypt(['email', 'phoneNumber'])
				contactInfo: any
			}

			// Get the metadata
			const metadata = getEncryptedFields(TestClass)

			// Verify the metadata
			expect(metadata).toBeInstanceOf(Map)
			expect(metadata.size).toBe(1)
			expect(metadata.has('contactInfo')).toBe(true)
			expect(metadata.get('contactInfo')).toEqual(['email', 'phoneNumber'])
		})

		it('should handle multiple decorated properties', () => {
			// Define a class with multiple decorated properties
			class TestClass {
				@Encrypt('email')
				contactInfo: any

				@Encrypt(['ssn', 'accountNumber'])
				financialInfo: any
			}

			// Get the metadata
			const metadata = getEncryptedFields(TestClass)

			// Verify the metadata
			expect(metadata).toBeInstanceOf(Map)
			expect(metadata.size).toBe(2)
			expect(metadata.has('contactInfo')).toBe(true)
			expect(metadata.get('contactInfo')).toEqual(['email'])
			expect(metadata.has('financialInfo')).toBe(true)
			expect(metadata.get('financialInfo')).toEqual(['ssn', 'accountNumber'])
		})
	})

	describe('createFieldEncryptors', () => {
		it('should create field encryptors for decorated properties', () => {
			// Define a class with decorated properties
			class TestClass {
				@Encrypt('email')
				contactInfo: any

				@Encrypt(['ssn', 'accountNumber'])
				financialInfo: any
			}

			// Create an instance
			const instance = new TestClass()

			// Create field encryptors
			const encryptors = createFieldEncryptors(instance, mockEncryptionService)

			// Verify the encryptors
			expect(encryptors).toBeInstanceOf(Map)
			expect(encryptors.size).toBe(2)
			expect(encryptors.has('contactInfo')).toBe(true)
			expect(encryptors.get('contactInfo')).toBeInstanceOf(FieldEncryptor)
			expect(encryptors.has('financialInfo')).toBe(true)
			expect(encryptors.get('financialInfo')).toBeInstanceOf(FieldEncryptor)
		})

		it('should return an empty map for a class without decorated properties', () => {
			// Define a class without decorated properties
			class TestClass {
				contactInfo: any
				financialInfo: any
			}

			// Create an instance
			const instance = new TestClass()

			// Create field encryptors
			const encryptors = createFieldEncryptors(instance, mockEncryptionService)

			// Verify the encryptors
			expect(encryptors).toBeInstanceOf(Map)
			expect(encryptors.size).toBe(0)
		})
	})

	describe('encryptMarkedFields', () => {
		it('should encrypt marked fields in an object', () => {
			// Define a class with decorated properties
			class TestClass {
				id: string
				name: string

				@Encrypt(['email', 'phoneNumber'])
				contactInfo: {
					email: string
					phoneNumber: string
					address: string
				}

				constructor(id: string, name: string, contactInfo: any) {
					this.id = id
					this.name = name
					this.contactInfo = contactInfo
				}
			}

			// Create an instance
			const instance = new TestClass('123', 'John Doe', {
				email: 'john.doe@example.com',
				phoneNumber: '+1234567890',
				address: '123 Main St',
			})

			// Encrypt marked fields
			const encrypted = encryptMarkedFields(instance, mockEncryptionService)

			// Verify the encrypted object
			expect(encrypted).not.toBe(instance) // Should return a new object
			expect(encrypted.id).toBe('123')
			expect(encrypted.name).toBe('John Doe')

			// Verify contactInfo
			expect(encrypted.contactInfo).not.toBe(instance.contactInfo)
			expect(encrypted.contactInfo.email).toEqual({
				content: 'encrypted-john.doe@example.com',
				iv: 'mock-iv',
				authTag: 'mock-auth-tag',
			})
			expect(encrypted.contactInfo.phoneNumber).toEqual({
				content: 'encrypted-+1234567890',
				iv: 'mock-iv',
				authTag: 'mock-auth-tag',
			})
			expect(encrypted.contactInfo.address).toBe('123 Main St') // Not encrypted

			// Verify original object is not modified
			expect(instance.contactInfo.email).toBe('john.doe@example.com')
			expect(instance.contactInfo.phoneNumber).toBe('+1234567890')
		})

		it('should handle missing properties', () => {
			// Define a class with decorated properties
			class TestClass {
				@Encrypt('email')
				contactInfo?: any // Optional property
			}

			// Create an instance without the optional property
			const instance = new TestClass()

			// Encrypt marked fields
			const encrypted = encryptMarkedFields(instance, mockEncryptionService)

			// Verify the encrypted object
			expect(encrypted).not.toBe(instance)
			expect(encrypted.contactInfo).toBeUndefined()
		})

		it('should handle null properties', () => {
			// Define a class with decorated properties
			class TestClass {
				@Encrypt('email')
				contactInfo: any
			}

			// Create an instance with null property
			const instance = new TestClass()
			instance.contactInfo = null

			// Encrypt marked fields
			const encrypted = encryptMarkedFields(instance, mockEncryptionService)

			// Verify the encrypted object
			expect(encrypted).not.toBe(instance)
			expect(encrypted.contactInfo).toBeNull()
		})
	})

	describe('decryptMarkedFields', () => {
		it('should decrypt marked fields in an object', () => {
			// Define a class with decorated properties
			class TestClass {
				id: string
				name: string

				@Encrypt(['email', 'phoneNumber'])
				contactInfo: {
					email: any
					phoneNumber: any
					address: string
				}

				constructor(id: string, name: string, contactInfo: any) {
					this.id = id
					this.name = name
					this.contactInfo = contactInfo
				}
			}

			// Create an instance with encrypted fields
			const instance = new TestClass('123', 'John Doe', {
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
			})

			// Decrypt marked fields
			const decrypted = decryptMarkedFields(instance, mockEncryptionService)

			// Verify the decrypted object
			expect(decrypted).not.toBe(instance) // Should return a new object
			expect(decrypted.id).toBe('123')
			expect(decrypted.name).toBe('John Doe')

			// Verify contactInfo
			expect(decrypted.contactInfo).not.toBe(instance.contactInfo)
			expect(decrypted.contactInfo.email).toBe('john.doe@example.com')
			expect(decrypted.contactInfo.phoneNumber).toBe('+1234567890')
			expect(decrypted.contactInfo.address).toBe('123 Main St') // Not encrypted

			// Verify original object is not modified
			expect(instance.contactInfo.email).toEqual({
				content: 'encrypted-john.doe@example.com',
				iv: 'mock-iv',
				authTag: 'mock-auth-tag',
			})
			expect(instance.contactInfo.phoneNumber).toEqual({
				content: 'encrypted-+1234567890',
				iv: 'mock-iv',
				authTag: 'mock-auth-tag',
			})
		})

		it('should handle missing properties', () => {
			// Define a class with decorated properties
			class TestClass {
				@Encrypt('email')
				contactInfo?: any // Optional property
			}

			// Create an instance without the optional property
			const instance = new TestClass()

			// Decrypt marked fields
			const decrypted = decryptMarkedFields(instance, mockEncryptionService)

			// Verify the decrypted object
			expect(decrypted).not.toBe(instance)
			expect(decrypted.contactInfo).toBeUndefined()
		})

		it('should handle null properties', () => {
			// Define a class with decorated properties
			class TestClass {
				@Encrypt('email')
				contactInfo: any
			}

			// Create an instance with null property
			const instance = new TestClass()
			instance.contactInfo = null

			// Decrypt marked fields
			const decrypted = decryptMarkedFields(instance, mockEncryptionService)

			// Verify the decrypted object
			expect(decrypted).not.toBe(instance)
			expect(decrypted.contactInfo).toBeNull()
		})
	})

	describe('end-to-end', () => {
		it('should correctly mark fields for encryption', () => {
			// Define a class with a decorated property
			class TestClass {
				@Encrypt('email')
				contactInfo: any
			}

			// Get the metadata
			const metadata = getEncryptedFields(TestClass)

			// Verify the metadata
			expect(metadata).toBeInstanceOf(Map)
			expect(metadata.size).toBe(1)
			expect(metadata.has('contactInfo')).toBe(true)
			expect(metadata.get('contactInfo')).toEqual(['email'])
		})

		it('should correctly create field encryptors', () => {
			// Define a class with a decorated property
			class TestClass {
				@Encrypt('email')
				contactInfo: any
			}

			// Create an instance
			const instance = new TestClass()

			// Create field encryptors
			const encryptors = createFieldEncryptors(instance, mockEncryptionService)

			// Verify the encryptors
			expect(encryptors).toBeInstanceOf(Map)
			expect(encryptors.size).toBe(1)
			expect(encryptors.has('contactInfo')).toBe(true)
			expect(encryptors.get('contactInfo')).toBeInstanceOf(FieldEncryptor)
		})

		it('should correctly encrypt fields', () => {
			// Define a class with a decorated property
			class TestClass {
				@Encrypt('email')
				contactInfo: any
			}

			// Create an instance
			const instance = new TestClass()
			instance.contactInfo = { email: 'test@example.com' }

			// Encrypt marked fields
			const encrypted = encryptMarkedFields(instance, mockEncryptionService)

			// Verify encrypted data
			expect(encrypted.contactInfo.email).toEqual({
				content: 'encrypted-test@example.com',
				iv: 'mock-iv',
				authTag: 'mock-auth-tag',
			})
		})
	})
})
