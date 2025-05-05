export class EncryptionError extends Error {
	public package: string
	public meta: Record<string, unknown> | null

	constructor(message: string, meta: Record<string, unknown> | null = null) {
		super(message)
		this.name = this.constructor.name
		this.package = 'encryption'
		this.meta = meta
		Object.setPrototypeOf(this, new.target.prototype)
	}
}
