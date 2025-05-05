import { Attributes, context, SpanKind, SpanStatusCode, trace } from '@opentelemetry/api'

export function createTracer(name: string) {
	return trace.getTracer(name)
}

/**
 * Create a span with the given name and options
 * @param name The name of the span
 * @param fn The function to execute within the span
 * @param kind The kind of span
 * @returns The result of the function
 */
export async function createSpan<T>(
	name: string,
	fn: () => Promise<T> | T,
	kind: SpanKind = SpanKind.INTERNAL
): Promise<T> {
	const tracer = createTracer('default-tracer')

	return tracer.startActiveSpan(name, { kind }, async (span) => {
		try {
			const result = await fn()
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

export function getCurrentSpan() {
	return trace.getSpan(context.active())
}

export function addSpanAttributes(attributes: Attributes) {
	const span = getCurrentSpan()
	if (span) {
		span.setAttributes(attributes)
	}
}
