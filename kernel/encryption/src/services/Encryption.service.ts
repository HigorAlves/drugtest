import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

import { EncryptedData, EncryptionConfig } from '@/types'
import { EncryptionError } from '@/utils/EncryptionError'

/**
 * Service for encrypting and decrypting sensitive data
 * Uses AES-256-GCM by default, which provides both confidentiality and integrity
 */
export class EncryptionService {
	private readonly secretKey: Buffer
	private readonly ivLength: number
	private readonly algorithm: string

	/**
	 * Creates a new EncryptionService
	 * @param config Configuration options
	 */
	constructor(config: EncryptionConfig) {
		if (!config.secretKey) {
			throw new EncryptionError('Secret key is required')
		}

		this.secretKey = Buffer.from(config.secretKey, 'utf-8')

		// Validate key length for AES-256
		if (this.secretKey.length !== 32) {
			throw new EncryptionError('Invalid key length. AES-256 requires a 32-byte key.', {
				keyLength: this.secretKey.length,
			})
		}

		this.ivLength = config.ivLength || 16 // 16 bytes = 128 bits
		this.algorithm = config.algorithm || 'aes-256-gcm'
	}

	/**
	 * Encrypts a string value
	 * @param value The value to encrypt
	 * @returns The encrypted data
	 */
	public encrypt(value: string): EncryptedData {
		try {
			// Generate a random initialization vector
			const iv = randomBytes(this.ivLength)

			// Create a cipher with the key, iv, and algorithm
			const cipher = createCipheriv(this.algorithm, this.secretKey, iv)
			// Encrypt the value
			let encrypted = cipher.update(value, 'utf8', 'base64')
			encrypted += cipher.final('base64')

			// Get the authentication tag if available
			// @ts-expect-error the method is valid
			const authTag = cipher.getAuthTag().toString('base64')

			return {
				content: encrypted,
				iv: iv.toString('base64'),
				authTag,
			}
		} catch (error) {
			throw new EncryptionError(`Encryption failed: ${(error as Error).message}`, { originalError: error })
		}
	}

	/**
	 * Decrypts an encrypted value
	 * @param encryptedData The encrypted data
	 * @returns The decrypted value
	 */
	public decrypt(encryptedData: EncryptedData): string {
		const { content, iv, authTag } = encryptedData

		if (!content || !iv) {
			throw new EncryptionError('Invalid encrypted data format: missing content or iv')
		}

		// Convert the base64 encoded values back to buffers
		const ivBuffer = Buffer.from(iv, 'base64')

		// Create a deciphering with the key, iv, and algorithm
		const decipher = createDecipheriv(this.algorithm, this.secretKey, ivBuffer)

		// Set the authentication tag if available
		if (authTag) {
			const authTagBuffer = Buffer.from(authTag, 'base64')
			// @ts-expect-error the method is valid
			decipher.setAuthTag(authTagBuffer)
		}

		// Decrypt the value
		let decrypted = decipher.update(content, 'base64', 'utf8')
		decrypted += decipher.final('utf8')

		return decrypted
	}
}
