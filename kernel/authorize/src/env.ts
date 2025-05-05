// @ts-expect-error No need to error on t3-oss
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'staging', 'production', 'test'], {
		description: 'The application environment',
	}),
	USE_MOCKS: z.string().optional(),
	FIREBASE_PROJECT_ID: z.string(),
	FIREBASE_CLIENT_EMAIL: z.string(),
	FIREBASE_PRIVATE_KEY: z.string(),
	FIREBASE_DATABASE_URL: z.string().optional(),
	FIREBASE_STORAGE_BUCKET: z.string().optional(),
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
		FIREBASE_PROJECT_ID: envSchema.shape.FIREBASE_PROJECT_ID,
		FIREBASE_CLIENT_EMAIL: envSchema.shape.FIREBASE_CLIENT_EMAIL,
		FIREBASE_PRIVATE_KEY: envSchema.shape.FIREBASE_PRIVATE_KEY,
		FIREBASE_DATABASE_URL: envSchema.shape.FIREBASE_DATABASE_URL,
		FIREBASE_STORAGE_BUCKET: envSchema.shape.FIREBASE_STORAGE_BUCKET,
	},
})
