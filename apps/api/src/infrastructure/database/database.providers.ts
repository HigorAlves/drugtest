import { DataSource } from 'typeorm'

export const databaseProviders = [
	{
		provide: 'DATA_SOURCE',
		useFactory: async () => {
			const dataSource = new DataSource({
				type: 'postgres',
				host: 'localhost',
				port: 5432,
				username: 'dev_local',
				password: 'dev_local',
				database: 'dev_local',
				entities: [__dirname + '/../**/*.entity{.ts,.js}'],
				synchronize: true,
			})

			return dataSource.initialize()
		},
	},
]
