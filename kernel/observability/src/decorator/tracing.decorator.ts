/* eslint-disable @typescript-eslint/no-explicit-any */
import { SpanKind, SpanStatusCode } from '@opentelemetry/api'

import { createTracer } from '@/utils'

/**
 * Decorator that creates a span for the decorated method
 * @param name Optional name for the span. If not provided, the method name will be used
 * @param kind Optional kind of span. Defaults to INTERNAL
 * @returns Method decorator
 */
export function Trace(name?: string, kind: SpanKind = SpanKind.INTERNAL) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value
		const className = target.constructor.name
		const spanName = name || `${className}.${propertyKey}`
		const tracer = createTracer(`${className}`)

		descriptor.value = function (...args: any[]) {
			return tracer.startActiveSpan(spanName, { kind }, async (span) => {
				try {
					// Add method arguments as span attributes (excluding sensitive data)
					const paramNames = getParameterNames(originalMethod)
					paramNames.forEach((paramName, index) => {
						// Skip adding parameters that might contain sensitive information
						if (
							!paramName.toLowerCase().includes('password') &&
							!paramName.toLowerCase().includes('token') &&
							!paramName.toLowerCase().includes('secret') &&
							!paramName.toLowerCase().includes('key')
						) {
							const value = args[index]
							if (value !== undefined && value !== null) {
								if (typeof value === 'object') {
									span.setAttribute(`param.${paramName}`, JSON.stringify(value))
								} else {
									span.setAttribute(`param.${paramName}`, String(value))
								}
							}
						}
					})

					const result = await originalMethod.apply(this, args)
					span.setStatus({ code: SpanStatusCode.OK })

					return result
				} catch (error) {
					span.setStatus({
						code: SpanStatusCode.ERROR,
						message: error instanceof Error ? error.message : String(error),
					})
					span.recordException(error as Error)
					throw error
				} finally {
					span.end()
				}
			})
		}

		return descriptor
	}
}

/**
 * Helper function to extract parameter names from a function
 * @param func The function to extract parameter names from
 * @returns Array of parameter names
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function getParameterNames(func: Function): string[] {
	const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm
	const ARGUMENT_NAMES = /([^\s,]+)/g

	const fnStr = func.toString().replace(STRIP_COMMENTS, '')
	const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)

	return result || []
}
