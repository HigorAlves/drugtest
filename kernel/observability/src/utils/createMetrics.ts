import { metrics } from '@opentelemetry/api'

/**
 * Create a meter with the given name
 * @param name The name of the meter
 * @returns A meter instance
 */
export function createMeter(name: string) {
	return metrics.getMeter(name)
}

/**
 * Create a counter metric
 * @param name The name of the counter
 * @param description The description of the counter
 * @param meterName The name of the meter to use
 * @returns A counter-instance
 */
export function createCounter(name: string, description: string, meterName = 'default-meter') {
	const meter = createMeter(meterName)
	return meter.createCounter(name, {
		description,
	})
}

/**
 * Create a histogram metric
 * @param name The name of the histogram
 * @param description The description of the histogram
 * @param meterName The name of the meter to use
 * @returns A histogram instance
 */
export function createHistogram(name: string, description: string, meterName = 'default-meter') {
	const meter = createMeter(meterName)
	return meter.createHistogram(name, {
		description,
	})
}

/**
 * Create an up-down counter metric
 * @param name The name of the up-down counter
 * @param description The description of the up-down counter
 * @param meterName The name of the meter to use
 * @returns An up-down counter-instance
 */
export function createUpDownCounter(name: string, description: string, meterName = 'default-meter') {
	const meter = createMeter(meterName)
	return meter.createUpDownCounter(name, {
		description,
	})
}

/**
 * Create a gauge metric (implemented as an observable gauge)
 * @param name The name of the gauge
 * @param description The description of the gauge
 * @param meterName The name of the meter to use
 * @returns An observable gauge instance
 */
export function createGauge(name: string, description: string, meterName = 'default-meter') {
	const meter = createMeter(meterName)
	return meter.createObservableGauge(name, {
		description,
	})
}

/**
 * Create a timer that measures the duration of a function execution
 * @param name The name of the timer
 * @param description The description of the timer
 * @param meterName The name of the meter to use
 * @returns A function that can be used to time another function
 */
export function createTimer(name: string, description: string, meterName = 'default-meter') {
	const histogram = createHistogram(name, description, meterName)

	return async function timeFunction<T>(fn: () => Promise<T> | T, attributes?: Record<string, string>): Promise<T> {
		const startTime = performance.now()
		try {
			return await fn()
		} finally {
			const duration = performance.now() - startTime
			histogram.record(duration, attributes)
		}
	}
}

/**
 * Create a function to track the rate of function calls
 * @param name The name of the rate tracker
 * @param description The description of the rate tracker
 * @param meterName The name of the meter to use
 * @returns A function that can be used to track the rate of another function
 */
export function createRateTracker(name: string, description: string, meterName = 'default-meter') {
	const counter = createCounter(name, description, meterName)

	return async function trackRate<T>(fn: () => Promise<T> | T, attributes?: Record<string, string>): Promise<T> {
		try {
			return await fn()
		} finally {
			counter.add(1, attributes)
		}
	}
}
