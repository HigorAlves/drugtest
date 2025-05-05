import { createLogger, InjectLogger, Logger } from '@enterprise/logger'

import { AppDataSource } from '@/postgres/data-source'
import {
	IDatabaseMetrics,
	IDatabaseMetricsRepository,
	ILockInfo,
	ITransactionStats,
} from '@/postgres/types/database.types'
import { mapPostgresError } from '@/postgres/utils/mappers'

export class PostgresDatabase implements IDatabaseMetricsRepository {
	@InjectLogger('PostgresData')
	private logger!: Logger
	private static instance: PostgresDatabase | null = null
	private static connectionRefCount = 0

	// Prevent external instantiation to enforce singleton
	private constructor() {
		this.logger = createLogger('PostgresData')
	}

	public static getInstance(): PostgresDatabase {
		if (!PostgresDatabase.instance) {
			PostgresDatabase.instance = new PostgresDatabase()
		}
		return PostgresDatabase.instance
	}

	private dbName = String(AppDataSource.options.database)

	async initialize(): Promise<void> {
		try {
			PostgresDatabase.connectionRefCount++
			this.logger.info(`🏁 Initializing database (ref count: ${PostgresDatabase.connectionRefCount})`)
			if (!AppDataSource.isInitialized) {
				await AppDataSource.initialize()
			} else if (!AppDataSource.isConnected) {
				// If the data source is initialized but not connected, reconnect
				await AppDataSource.connect()
				this.logger.info('🔄 Reconnected to database')
			}
		} catch (error) {
			PostgresDatabase.connectionRefCount--
			const friendlyMessage = mapPostgresError(error)
			this.logger.error(`🐞 ${friendlyMessage}`)
		}
	}

	async destroy(): Promise<void> {
		PostgresDatabase.connectionRefCount = 0
		if (AppDataSource.isInitialized) {
			this.logger.info('🛑 Forcefully shutting down database')
			await AppDataSource.destroy()
		}
	}

	get database() {
		return AppDataSource
	}

	async getDatabaseMetrics(): Promise<IDatabaseMetrics> {
		if (!AppDataSource.isInitialized) {
			await this.initialize()
		}

		const activeConnectionsResult = await AppDataSource.query(`SELECT COUNT(*) AS count FROM pg_stat_activity`)
		const txStatsResult = await AppDataSource.query(
			`SELECT xact_commit, xact_rollback 
       FROM pg_stat_database 
       WHERE datname = $1`,
			[this.dbName]
		)
		const sizeResult = await AppDataSource.query(`SELECT pg_database_size($1) AS size`, [this.dbName])
		const locksResult = await AppDataSource.query(`SELECT * FROM pg_locks`)
		const uptimeResult = await AppDataSource.query(`SELECT pg_postmaster_start_time() AS start_time`)

		const txStats = txStatsResult[0]
		const transactionStats: ITransactionStats = {
			commits: Number(txStats.xact_commit),
			rollbacks: Number(txStats.xact_rollback),
		}
		const activeConnections = parseInt(activeConnectionsResult[0].count, 10)
		const databaseSizeBytes = parseInt(sizeResult[0].size, 10)
		const databaseSizeGigabytes = parseFloat((databaseSizeBytes / (1024 * 1024 * 1024)).toFixed(4))
		const startTime = new Date(uptimeResult[0].start_time)
		const uptimeSeconds = Math.floor((Date.now() - startTime.getTime()) / 1000)
		const uptimeMinutes = Math.floor(uptimeSeconds / 60)
		const locks = locksResult as ILockInfo[]

		return Object.freeze({
			name: this.dbName,
			activeConnections,
			transactionStats,
			size: {
				bytes: databaseSizeBytes,
				gigabytes: databaseSizeGigabytes,
			},
			locks,
			uptime: {
				seconds: uptimeSeconds,
				minutes: uptimeMinutes,
			},
		})
	}

	async shutdown(): Promise<void> {
		try {
			// Decrement the reference count, but ensure it doesn't go below 0
			PostgresDatabase.connectionRefCount = Math.max(0, PostgresDatabase.connectionRefCount - 1)
			this.logger.info(`🛑 Shutting down database (ref count: ${PostgresDatabase.connectionRefCount})`)

			// Only destroy the connection if no one else is using it
			if (PostgresDatabase.connectionRefCount === 0 && AppDataSource.isInitialized) {
				// Wait for any pending operations to complete
				await new Promise((resolve) => setTimeout(resolve, 100))

				if (AppDataSource.isConnected) {
					await AppDataSource.destroy()
					this.logger.info('🛑 Database connection destroyed')
				}
			}
		} catch (error) {
			this.logger.error(error)
			throw new Error('Error during database shutdown')
		}
	}
}
