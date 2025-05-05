import { EnterpriseError } from '@/EnterpriseError'

interface PostgresError extends Error {
	code?: string
	detail?: string
	constraint?: string
}

export class DatabaseError extends EnterpriseError {
	constructor(error: PostgresError, packageName: string = 'typeorm/database') {
		let message = error.message || 'Database operation failed'
		if (error.code) {
			message = `[Code: ${error.code}] ${message}`
		}

		const meta = {
			code: error.code,
			detail: error.detail,
			constraint: error.constraint,
		}

		super(message, packageName, meta)
	}
}
