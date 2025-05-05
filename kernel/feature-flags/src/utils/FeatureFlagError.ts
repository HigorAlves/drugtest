import { EnterpriseError } from '@enterprise/error'

export enum FeatureFlagErrorCode {
	FLAG_NOT_FOUND = 'FLAG_NOT_FOUND',
	INVALID_FLAG = 'INVALID_FLAG',
	PROVIDER_ERROR = 'PROVIDER_ERROR',
	EVALUATION_ERROR = 'EVALUATION_ERROR',
	INITIALIZATION_ERROR = 'INITIALIZATION_ERROR',
}

export class FeatureFlagError extends EnterpriseError {
	public code: FeatureFlagErrorCode
	public readonly name: string = 'feature-flags'
	public readonly meta: Record<string, unknown> | null = null

	constructor(
		message: string,
		code: FeatureFlagErrorCode = FeatureFlagErrorCode.EVALUATION_ERROR,
		meta: Record<string, unknown> | null = null
	) {
		super(message, 'feature-flags', meta)
		this.code = code
		this.name = 'FeatureFlagError'
		Object.setPrototypeOf(this, new.target.prototype)
	}
}
