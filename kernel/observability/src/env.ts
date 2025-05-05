// @ts-expect-error No need to error on t3-oss
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'staging', 'production', 'test'], {
		description: 'The application environment',
	}),
	USE_MOCKS: z.string().optional(),

	// OpenTelemetry configuration
	OTEL_SERVICE_NAME: z.string().default('enterprise-app'),
	OTEL_SERVICE_VERSION: z.string().default('0.0.0-alpha'),
	OTEL_EXPORTER_OTLP_ENDPOINT: z.string().default('http://localhost:4318'),
	OTEL_EXPORTER_OTLP_HEADERS: z.string().optional(),
	OTEL_TRACES_SAMPLER: z
		.enum([
			'always_on',
			'always_off',
			'traceidratio',
			'parentbased_always_on',
			'parentbased_always_off',
			'parentbased_traceidratio',
		])
		.default('always_on'),
	OTEL_TRACES_SAMPLER_ARG: z.string().optional(),
	OTEL_LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug', 'verbose']).default('info'),

	// Application specific
	APP_VERSION: z.string().default('0.0.0'),
	APP_ENVIRONMENT: z.string().default('development'),
})

const parsedEnv = envSchema.safeParse(process.env)
if (!parsedEnv.success) {
	console.error('Environment validation errors:', parsedEnv.error.format())
	throw new Error('Environment variables did not pass validation')
}

export const ENV = createEnv({
	runtimeEnv: parsedEnv.data,
	emptyStringAsUndefined: true,
	server: {
		NODE_ENV: envSchema.shape.NODE_ENV,
		USE_MOCKS: envSchema.shape.USE_MOCKS,

		// OpenTelemetry configuration
		OTEL_SERVICE_NAME: envSchema.shape.OTEL_SERVICE_NAME,
		OTEL_SERVICE_VERSION: envSchema.shape.OTEL_SERVICE_NAME,
		OTEL_EXPORTER_OTLP_ENDPOINT: envSchema.shape.OTEL_EXPORTER_OTLP_ENDPOINT,
		OTEL_EXPORTER_OTLP_HEADERS: envSchema.shape.OTEL_EXPORTER_OTLP_HEADERS,
		OTEL_TRACES_SAMPLER: envSchema.shape.OTEL_TRACES_SAMPLER,
		OTEL_TRACES_SAMPLER_ARG: envSchema.shape.OTEL_TRACES_SAMPLER_ARG,
		OTEL_LOG_LEVEL: envSchema.shape.OTEL_LOG_LEVEL,

		// Application specific
		APP_VERSION: envSchema.shape.APP_VERSION,
		APP_ENVIRONMENT: envSchema.shape.APP_ENVIRONMENT,
	},
})
