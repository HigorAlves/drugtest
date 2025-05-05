import { QueryFailedError } from 'typeorm'

/**
 * Maps PostgreSQL error codes to user-friendly messages.
 * You can extend this function with more codes as needed.
 *
 * @param error - The error thrown from TypeORM
 * @returns A friendly error message
 */
export function mapPostgresError(error: unknown): string {
	if (error instanceof QueryFailedError && error.driverError) {
		const pgError = error.driverError
		switch (pgError.code) {
			case '23505':
				return 'A record with this value already exists (unique violation).'
			case '23503':
				return 'Operation failed due to a foreign key constraint.'
			case '23502':
				return 'A required field is missing.'
			case '42P01':
				return 'The database table does not exist.'
			default:
				return 'A database error occurred.'
		}
	}
	return 'An unexpected error occurred while accessing the database.'
}

export const CurrencyCodeMapper = {
	BRL: { name: 'Brazilian Real', symbol: 'R$' },
	USD: { name: 'United States Dollar', symbol: '$' },
	EUR: { name: 'Euro', symbol: '€' },
	GBP: { name: 'British Pound Sterling', symbol: '£' },
	CAD: { name: 'Canadian Dollar', symbol: 'C$' },
	AUD: { name: 'Australian Dollar', symbol: 'A$' },
	JPY: { name: 'Japanese Yen', symbol: '¥' },
	CHF: { name: 'Swiss Franc', symbol: 'CHF' },
	CNY: { name: 'Chinese Yuan', symbol: '¥' },
	INR: { name: 'Indian Rupee', symbol: '₹' },
	ARS: { name: 'Argentine Peso', symbol: '$' },
	MXN: { name: 'Mexican Peso', symbol: '$' },
	ZAR: { name: 'South African Rand', symbol: 'R' },
} as const

export type CurrencyCode = keyof typeof CurrencyCodeMapper
