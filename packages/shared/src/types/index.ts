import { PostgresDatabase } from '@enterprise/database'

export interface ContextValue {
	dataSources: {
		postgres: {
			instance: PostgresDatabase
		}
	}
}
