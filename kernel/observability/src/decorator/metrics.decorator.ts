/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCounter, createHistogram } from '@/utils'

/**
 * Decorator that measures the execution time of the decorated method
 * @param name Optional name for the metric. If not provided, the method name will be used
 * @param description Optional description for the metric
 * @returns Method decorator
 */
export function Measure(name?: string, description?: string) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value
		const className = target.constructor.name
		const methodName = propertyKey
		const metricName = name || `${className}.${methodName}.duration`
		const metricDescription = description || `Execution time of ${className}.${methodName}`
		const histogram = createHistogram(metricName, metricDescription, className)

		descriptor.value = async function (...args: any[]) {
			const startTime = performance.now()
			try {
				return await originalMethod.apply(this, args)
			} finally {
				const duration = performance.now() - startTime
				histogram.record(duration, {
					class: className,
					method: methodName,
				})
			}
		}

		return descriptor
	}
}

/**
 * Decorator that counts the number of times the decorated method is called
 * @param name Optional name for the metric. If not provided, the method name will be used
 * @param description Optional description for the metric
 * @returns Method decorator
 */
export function Count(name?: string, description?: string) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value
		const className = target.constructor.name
		const methodName = propertyKey
		const metricName = name || `${className}.${methodName}.count`
		const metricDescription = description || `Number of calls to ${className}.${methodName}`
		const counter = createCounter(metricName, metricDescription, className)

		descriptor.value = async function (...args: any[]) {
			try {
				return await originalMethod.apply(this, args)
			} finally {
				counter.add(1, {
					class: className,
					method: methodName,
				})
			}
		}

		return descriptor
	}
}

/**
 * Decorator that measures the execution time and counts the number of times the decorated method is called
 * @param options Optional configuration for the metrics
 * @returns Method decorator
 */
export function Metrics(
	options: {
		name?: string
		description?: string
		measureTime?: boolean
		countCalls?: boolean
	} = {}
) {
	const { measureTime = true, countCalls = true } = options

	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const className = target.constructor.name
		const methodName = propertyKey

		if (measureTime) {
			const metricName = options.name ? `${options.name}.duration` : `${className}.${methodName}.duration`
			const metricDescription = options.description || `Execution time of ${className}.${methodName}`
			const histogram = createHistogram(metricName, metricDescription, className)

			const measuredMethod = descriptor.value
			descriptor.value = async function (...args: any[]) {
				const startTime = performance.now()
				try {
					return await measuredMethod.apply(this, args)
				} finally {
					const duration = performance.now() - startTime
					histogram.record(duration, {
						class: className,
						method: methodName,
					})
				}
			}
		}

		if (countCalls) {
			const metricName = options.name ? `${options.name}.count` : `${className}.${methodName}.count`
			const metricDescription = options.description || `Number of calls to ${className}.${methodName}`
			const counter = createCounter(metricName, metricDescription, className)

			const countedMethod = descriptor.value
			descriptor.value = async function (...args: any[]) {
				try {
					return await countedMethod.apply(this, args)
				} finally {
					counter.add(1, {
						class: className,
						method: methodName,
					})
				}
			}
		}

		return descriptor
	}
}
