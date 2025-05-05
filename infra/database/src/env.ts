// @ts-expect-error No need to error on t3-oss
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'staging', 'production', 'test'], {
		description: 'The application environment',
	}),
	USE_MOCKS: z.string().optional(),
	TYPEORM_CONNECTION: z.enum(['postgres', 'sqlite']),
	TYPEORM_HOST: z.string(),
	TYPEORM_PORT: z.string(),
	TYPEORM_USERNAME: z.string(),
	TYPEORM_PASSWORD: z.string(),
	TYPEORM_DATABASE: z.string(),
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
		TYPEORM_CONNECTION: envSchema.shape.TYPEORM_CONNECTION,
		TYPEORM_HOST: envSchema.shape.TYPEORM_HOST,
		TYPEORM_PORT: envSchema.shape.TYPEORM_PORT,
		TYPEORM_USERNAME: envSchema.shape.TYPEORM_USERNAME,
		TYPEORM_PASSWORD: envSchema.shape.TYPEORM_PASSWORD,
		TYPEORM_DATABASE: envSchema.shape.TYPEORM_DATABASE,
	},
})
