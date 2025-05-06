import { DataSource } from 'typeorm'

export const databaseProviders = [
	{
		provide: 'DATA_SOURCE',
		useFactory: async () => {
			const dataSource = new DataSource({
				type: 'postgres',
				host: process.env.TYPEORM_HOST || 'localhost',
				port: parseInt(process.env.TYPEORM_PORT || '5432', 10),
				username: process.env.TYPEORM_USERNAME || 'dev_local',
				password: process.env.TYPEORM_PASSWORD || 'dev_local',
				database: process.env.TYPEORM_DATABASE || 'dev_local',
				entities: [__dirname + '/../**/*.entity{.ts,.js}'],
				synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
			})

			return dataSource.initialize()
		},
	},
]
