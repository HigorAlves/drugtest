import { ZodError } from 'zod'

import { EnterpriseError, ERROR_SAMPLE } from '@/EnterpriseError'

export class ValidationError extends EnterpriseError {
	constructor(
		arg: string | ZodError = ERROR_SAMPLE.message,
		packageName: string = ERROR_SAMPLE.package,
		meta: Record<string, unknown> | null = null
	) {
		if (arg instanceof ZodError) {
			const data = arg.flatten()
			super('Zod schema validation failed', packageName, data)
		} else {
			super(arg, packageName, meta)
		}
	}
}
