import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { PostgresDatabase, RepositoryType } from '@/postgres'
import { getRepository } from '@/postgres/repository'

describe('Report', () => {
	const dbInstance = PostgresDatabase.getInstance()
	let reportRepository: ReturnType<typeof getRepository<typeof RepositoryType.REPORT>>

	beforeAll(async () => {
		await dbInstance.initialize()
		reportRepository = getRepository(RepositoryType.REPORT)
	})

	beforeEach(async () => {
		// Clear the report table before each test
		await reportRepository.delete({})
	})

	afterAll(async () => {
		await dbInstance.shutdown()
	})

	it('should have no report saved initially', async () => {
		const count = await reportRepository.count()
		expect(count).toBe(0)
	})
})
