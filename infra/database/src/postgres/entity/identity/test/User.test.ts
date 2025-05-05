import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { PostgresDatabase, RepositoryType } from '@/postgres'
import { getRepository } from '@/postgres/repository'

describe('User', () => {
	const dbInstance = PostgresDatabase.getInstance()
	let userRepository: ReturnType<typeof getRepository<typeof RepositoryType.USER>>

	beforeAll(async () => {
		await dbInstance.initialize()
		userRepository = getRepository(RepositoryType.USER)
	})

	beforeEach(async () => {
		// Clear the user table before each test
		await userRepository.delete({})
	})

	afterAll(async () => {
		await dbInstance.shutdown()
	})

	it('should have no user saved initially', async () => {
		const count = await userRepository.count()
		expect(count).toBe(0)
	})
})
