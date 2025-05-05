export const ERROR_SAMPLE = {
	message: 'NO MESSAGE WAS PROVIDED',
	package: 'NOT-PROVIDED',
	meta: null,
}

export class EnterpriseError extends Error {
	public package?: string
	public meta?: Record<string, unknown> | null

	constructor(
		message: string = ERROR_SAMPLE.message,
		packageName: string = ERROR_SAMPLE.package,
		meta: Record<string, unknown> | null
	) {
		super(message)
		this.package = packageName
		this.name = this.constructor.name
		this.meta = meta
		Object.setPrototypeOf(this, new.target.prototype)
	}
}
