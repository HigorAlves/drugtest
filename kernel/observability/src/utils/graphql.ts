/* eslint-disable @typescript-eslint/no-explicit-any */
import { SpanKind, SpanStatusCode } from '@opentelemetry/api'

import { createTracer } from './createTracer'

export interface GraphQLInstrumentationOptions {
	enabled?: boolean
	captureDocument?: boolean
	captureVariables?: boolean
	captureResult?: boolean
	depth?: number
}

/**
 * Create a span for a GraphQL operation
 * @param operationName The name of the GraphQL operation
 * @param fn The function to execute within the span
 * @param options Additional options for the span
 * @returns The result of the function
 */
export async function createGraphQLSpan<T>(
	operationName: string,
	fn: () => Promise<T> | T,
	options: {
		document?: string
		variables?: Record<string, unknown>
		kind?: SpanKind
	} = {}
): Promise<T> {
	const { document, variables, kind = SpanKind.CLIENT } = options
	const tracer = createTracer('graphql')

	return tracer.startActiveSpan(`graphql.${operationName}`, { kind }, async (span) => {
		try {
			span.setAttribute('graphql.operation', operationName)
			const result = await fn()
			if (document) {
				span.setAttribute('graphql.document', document)
			}
			if (variables) {
				span.setAttribute('graphql.variables', JSON.stringify(variables))
			}

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

/**
 * Decorator for GraphQL resolvers that creates a span for the resolver
 * @param operationName Optional name for the operation. If not provided, the method name will be used
 * @param options Additional options for the span
 * @returns Method decorator
 */
export function GraphQLTrace(operationName?: string, options: { kind?: SpanKind } = {}) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value
		const className = target.constructor.name
		const methodName = propertyKey
		const spanName = operationName || `${className}.${methodName}`
		const { kind = SpanKind.SERVER } = options

		descriptor.value = async function (...args: any[]) {
			const tracer = createTracer('graphql')

			return tracer.startActiveSpan(`graphql.resolver.${spanName}`, { kind }, async (span) => {
				try {
					span.setAttribute('graphql.resolver.class', className)
					span.setAttribute('graphql.resolver.method', methodName)

					// If this is a GraphQL resolver, the 3rd argument is typically the context
					// and the 4th argument is the resolver info
					if (args.length >= 4) {
						const info = args[3]
						if (info && typeof info === 'object' && 'fieldName' in info) {
							span.setAttribute('graphql.field', info.fieldName)

							if (info.operation && info.operation.operation) {
								span.setAttribute('graphql.operation.type', info.operation.operation)
							}

							if (info.operation && info.operation.name && info.operation.name.value) {
								span.setAttribute('graphql.operation.name', info.operation.name.value)
							}
						}
					}

					// Execute the original method
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
