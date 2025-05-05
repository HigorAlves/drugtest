/**
 * Domain types
 */
export interface ILockInfo {
	locktype: string
	database: number
	relation: number
	page: number | null
	tuple: number | null
	virtualxid: string | null
	transactionid: number | null
	classid: number | null
	objid: number | null
	objsubid: number | null
	virtualtransaction: string
	pid: number
	mode: string
	granted: boolean
	fastpath: boolean
	waitstart: Date | null
}

export interface ITransactionStats {
	commits: number
	rollbacks: number
}

export interface ISizeInfo {
	bytes: number
	gigabytes: number
}

export interface IUptimeInfo {
	seconds: number
	minutes: number
}

export interface IDatabaseMetrics {
	name: string
	activeConnections: number
	transactionStats: ITransactionStats
	size: ISizeInfo
	locks: ILockInfo[]
	uptime: IUptimeInfo
}

/**
 * Repository port for database metrics.
 */
export interface IDatabaseMetricsRepository {
	initialize(): Promise<void>
	getDatabaseMetrics(): Promise<IDatabaseMetrics>
	destroy(): Promise<void>
	shutdown(): Promise<void>
}
