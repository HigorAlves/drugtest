import type { Logger as WinstonLogger } from 'winston'

import { createLogger } from '@/createLogger'

export function InjectLogger(customLabel?: string): PropertyDecorator {
	return (target: object, propertyKey: string | symbol) => {
		const loggerLabel = customLabel || target.constructor.name
		const logger: WinstonLogger = createLogger(loggerLabel)
		Object.defineProperty(target, propertyKey, {
			value: logger,
			writable: false,
			configurable: false,
		})
	}
}
