import { DataSource } from 'typeorm'

import { ENV } from '@/env'

const isTest = ENV.NODE_ENV === 'test'
const isDev = ENV.NODE_ENV === 'development'
const isTestOrDev = isTest || isDev

export const AppDataSource = new DataSource({
	type: ENV.TYPEORM_CONNECTION,
	host: ENV.TYPEORM_HOST,
	port: parseInt(ENV.TYPEORM_PORT),
	username: ENV.TYPEORM_USERNAME,
	password: ENV.TYPEORM_PASSWORD,
	database: ENV.TYPEORM_DATABASE,
	useUTC: true,
	synchronize: isTestOrDev,
	logging: isTest,
	migrationsTableName: 'migrations',
	migrations: ['src/postgres/migration/**/!(*.test|*.spec).ts'],
	entities: [
		// Entities will be provided by the API
	],
	subscribers: [],
})
