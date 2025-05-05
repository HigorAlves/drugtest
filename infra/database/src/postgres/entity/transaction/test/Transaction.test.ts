import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { PostgresDatabase, RepositoryType } from '@/postgres'
import { Account, Category, DocumentType, User } from '@/postgres/entity'
import { getRepository } from '@/postgres/repository'

describe('Transaction', () => {
	const dbInstance = PostgresDatabase.getInstance()
	let transactionRepository: ReturnType<typeof getRepository<typeof RepositoryType.TRANSACTION>>
	let userRepository: ReturnType<typeof getRepository<typeof RepositoryType.USER>>
	let accountRepository: ReturnType<typeof getRepository<typeof RepositoryType.ACCOUNT>>
	let categoryRepository: ReturnType<typeof getRepository<typeof RepositoryType.CATEGORY>>

	let userId: string
	let accountId: string
	let categoryId: string

	beforeAll(async () => {
		await dbInstance.initialize()
		transactionRepository = getRepository(RepositoryType.TRANSACTION)
		userRepository = getRepository(RepositoryType.USER)
		accountRepository = getRepository(RepositoryType.ACCOUNT)
		categoryRepository = getRepository(RepositoryType.CATEGORY)

		// Generate unique values for this test run
		const uniqueId = Date.now().toString()

		// Create a user for testing with unique values
		const user = new User()
		user.fullName = `Test User ${uniqueId}`
		user.document = `${uniqueId}12345`
		user.taxNumber = `${uniqueId}12345`
		user.documentType = DocumentType.CPF
		user.currency = 'USD'
		user.locale = 'en-US'

		const savedUser = await userRepository.save(user)
		userId = savedUser.id

		// Create an account for testing with unique values
		const account = new Account()
		account.userId = userId
		account.name = `Test Account ${uniqueId}`
		account.type = 'BANK'
		account.subtype = 'CHECKING_ACCOUNT'
		account.number = `${uniqueId.substring(0, 9)}`
		account.balance = '1000.00'
		account.currencyCode = 'USD'
		account.taxNumber = `${uniqueId}12345`
		account.owner = `Test User ${uniqueId}`

		const savedAccount = await accountRepository.save(account)
		accountId = savedAccount.id

		// Create a category for testing with unique values
		const category = new Category()
		category.userId = userId
		category.name = `Test Category ${uniqueId}`
		category.color = '#FF0000'
		category.icon = `test-icon-${uniqueId}`

		const savedCategory = await categoryRepository.save(category)
		categoryId = savedCategory.id
	})

	beforeEach(async () => {
		// Clear the transaction table before each test
		await transactionRepository.delete({})
	})

	afterAll(async () => {
		// Clean up
		await categoryRepository.delete({ id: categoryId })
		await accountRepository.delete({ id: accountId })
		await userRepository.delete({ id: userId })
		await dbInstance.shutdown()
	})

	it('should have no transaction saved initially', async () => {
		const count = await transactionRepository.count()
		expect(count).toBe(0)
	})
})
