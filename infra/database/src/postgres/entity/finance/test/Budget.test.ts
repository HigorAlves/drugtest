import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { PostgresDatabase, RepositoryType } from '@/postgres'
import { getRepository } from '@/postgres/repository'

describe('Budget', () => {
	const dbInstance = PostgresDatabase.getInstance()
	let budgetRepository: ReturnType<typeof getRepository<typeof RepositoryType.BUDGET>>

	beforeAll(async () => {
		await dbInstance.initialize()
		budgetRepository = getRepository(RepositoryType.BUDGET)
	})

	beforeEach(async () => {
		// Clear the budget table before each test
		await budgetRepository.delete({})
	})

	afterAll(async () => {
		await dbInstance.shutdown()
	})

	it('should have no budget saved initially', async () => {
		const count = await budgetRepository.count()
		expect(count).toBe(0)
	})
})
