/* eslint-disable @typescript-eslint/no-explicit-any */
import { EncryptionService } from '@/services'

import { EncryptedData, FieldEncryptionConfig } from '../types'
import { EncryptionError } from './EncryptionError'

/**
 * Utility for encrypting and decrypting object fields
 */
export class FieldEncryptor {
	private readonly encryptionService: EncryptionService
	private readonly config: FieldEncryptionConfig

	/**
	 * Creates a new FieldEncryptor
	 * @param encryptionService The encryption service to use
	 * @param config Configuration for field encryption
	 */
	constructor(encryptionService: EncryptionService, config: FieldEncryptionConfig) {
		this.encryptionService = encryptionService
		this.config = {
			fields: config.fields,
			throwOnMissingField: config.throwOnMissingField || false,
		}
	}

	/**
	 * Encrypts specified fields in an object
	 * @param obj The object to encrypt fields in
	 * @returns A new object with encrypted fields
	 */
	public encryptFields<T extends Record<string, any>>(obj: T): Record<string, any> {
		if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
			throw new EncryptionError('Invalid object provided for field encryption')
		}

		const result = { ...obj } as Record<string, any>

		for (const field of this.config.fields) {
			if (field in obj) {
				const value = obj[field]
				result[field] = this.encryptionService.encrypt(value)
			} else if (this.config.throwOnMissingField) {
				throw new EncryptionError(`Field '${field}' not found in object`)
			}
		}

		return result
	}

	/**
	 * Decrypts specified fields in an object
	 * @param obj The object to decrypt fields in
	 * @returns A new object with decrypted fields
	 */
	public decryptFields<T extends Record<string, any>>(obj: T): Record<string, any> {
		if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
			throw new EncryptionError('Invalid object provided for field decryption')
		}

		const result = { ...obj } as Record<string, any>

		for (const field of this.config.fields) {
			if (field in obj) {
				const value = obj[field]

				// Check if the value is an encrypted data object
				if (this.isEncryptedData(value)) {
					try {
						result[field] = this.encryptionService.decrypt(value)
					} catch (error) {
						if (this.config.throwOnMissingField) {
							throw new EncryptionError(`Failed to decrypt field '${field}'`, { originalError: error })
						}
						// Keep the encrypted value if decryption fails and we're not throwing
					}
				}
			} else if (this.config.throwOnMissingField) {
				throw new EncryptionError(`Field '${field}' not found in object`)
			}
		}

		return result
	}

	/**
	 * Checks if a value is an EncryptedData object
	 * @param value The value to check
	 * @returns True if the value is an EncryptedData object
	 */
	private isEncryptedData(value: any): value is EncryptedData {
		return value && typeof value === 'object' && 'content' in value && 'iv' in value && 'authTag' in value
	}
}
