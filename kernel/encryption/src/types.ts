/**
 * Configuration options for the EncryptionService
 */
export interface EncryptionConfig {
  /**
   * The secret key used for encryption and decryption
   * Must be 32 bytes (256 bits) for AES-256
   */
  secretKey: string

  /**
   * The length of the initialization vector in bytes
   * Default: 16 bytes (128 bits)
   */
  ivLength?: number

  /**
   * The length of the authentication tag in bytes
   * Default: 16 bytes (128 bits)
   */
  authTagLength?: number

  /**
   * The encryption algorithm to use
   * Default: 'aes-256-gcm'
   */
  algorithm?: string
}

/**
 * Represents encrypted data
 */
export interface EncryptedData {
  /**
   * The encrypted content in base64 format
   */
  content: string

  /**
   * The initialization vector in base64 format
   */
  iv: string

  /**
   * The authentication tag in base64 format
   * May be undefined in some environments
   */
  authTag?: string
}

/**
 * Configuration options for field encryption
 */
export interface FieldEncryptionConfig {
  /**
   * The fields to encrypt
   */
  fields: string[]

  /**
   * Whether to throw an error if a field is missing
   * Default: false
   */
  throwOnMissingField?: boolean
}