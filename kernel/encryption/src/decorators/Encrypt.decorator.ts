/* eslint-disable @typescript-eslint/no-explicit-any */
import { EncryptionService } from '@/services'
import { FieldEncryptor } from '@/utils/FieldEncryptor'

// Symbol to store metadata about encrypted fields
const ENCRYPTED_FIELDS_METADATA = Symbol('encryptedFields')

/**
 * Interface for the class constructor that can have encrypted fields
 */
interface EncryptableConstructor {
	prototype: any
	[ENCRYPTED_FIELDS_METADATA]?: Map<string, string[]>
}

/**
 * Decorator factory for marking fields for encryption
 * @param fields Field or array of fields to encrypt
 * @returns Property decorator
 */
export function Encrypt(fields: string | string[]) {
	return function (target: any, propertyKey: string) {
		const constructor = target.constructor as EncryptableConstructor

		// Initialize metadata storage if it doesn't exist
		if (!constructor[ENCRYPTED_FIELDS_METADATA]) {
			constructor[ENCRYPTED_FIELDS_METADATA] = new Map<string, string[]>()
		}

		// Convert a single field to array
		const fieldArray = Array.isArray(fields) ? fields : [fields]

		// Store the fields to encrypt for this property
		constructor[ENCRYPTED_FIELDS_METADATA].set(propertyKey, fieldArray)
	}
}

/**
 * Gets the encrypted fields metadata for a class
 * @param constructor The class constructor
 * @returns Map of property names to fields to encrypt
 */
export function getEncryptedFields(constructor: any): Map<string, string[]> {
	return (constructor[ENCRYPTED_FIELDS_METADATA] as Map<string, string[]>) || new Map()
}

/**
 * Creates a field encryptor for a specific class instance
 * @param instance The class instance
 * @param encryptionService The encryption service to use
 * @returns A map of property names to field encryptors
 */
export function createFieldEncryptors(
	instance: any,
	encryptionService: EncryptionService
): Map<string, FieldEncryptor> {
	const constructor = instance.constructor as EncryptableConstructor
	const encryptedFields = getEncryptedFields(constructor)
	const encryptors = new Map<string, FieldEncryptor>()

	for (const [propertyKey, fields] of encryptedFields.entries()) {
		encryptors.set(propertyKey, new FieldEncryptor(encryptionService, { fields }))
	}

	return encryptors
}

/**
 * Encrypts all marked fields in an object
 * @param instance The class instance
 * @param encryptionService The encryption service to use
 * @returns The instance with encrypted fields
 */
export function encryptMarkedFields(instance: any, encryptionService: EncryptionService): any {
	const encryptors = createFieldEncryptors(instance, encryptionService)
	const result = { ...instance }

	for (const [propertyKey, encryptor] of encryptors.entries()) {
		if (propertyKey in instance && instance[propertyKey]) {
			result[propertyKey] = encryptor.encryptFields(instance[propertyKey])
		}
	}

	return result
}

/**
 * Decrypts all marked fields in an object
 * @param instance The class instance
 * @param encryptionService The encryption service to use
 * @returns The instance with decrypted fields
 */
export function decryptMarkedFields(instance: any, encryptionService: EncryptionService): any {
	const encryptors = createFieldEncryptors(instance, encryptionService)
	const result = { ...instance }

	for (const [propertyKey, encryptor] of encryptors.entries()) {
		if (propertyKey in instance && instance[propertyKey]) {
			result[propertyKey] = encryptor.decryptFields(instance[propertyKey])
		}
	}

	return result
}
