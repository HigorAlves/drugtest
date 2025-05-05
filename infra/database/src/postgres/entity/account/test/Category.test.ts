import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { PostgresDatabase, RepositoryType } from '@/postgres'
import { getRepository } from '@/postgres/repository'

describe('Category', () => {
	const dbInstance = PostgresDatabase.getInstance()
	let categoryRepository: ReturnType<typeof getRepository<typeof RepositoryType.CATEGORY>>

	beforeAll(async () => {
		await dbInstance.initialize()
		categoryRepository = getRepository(RepositoryType.CATEGORY)
	})

	beforeEach(async () => {
		// Clear the category table before each test
		await categoryRepository.delete({})
	})

	afterAll(async () => {
		await dbInstance.shutdown()
	})

	it('should have no category saved initially', async () => {
		const count = await categoryRepository.count()
		expect(count).toBe(0)
	})
})
