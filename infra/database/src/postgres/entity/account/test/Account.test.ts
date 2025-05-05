import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { PostgresDatabase, RepositoryType } from '@/postgres'
import { DocumentType, User } from '@/postgres/entity'
import { getRepository } from '@/postgres/repository'

import { Account } from '../Account'
import { BankAccount } from '../BankAccount'
import { CreditAccount } from '../CreditAccount'

describe('Account', () => {
	const dbInstance = PostgresDatabase.getInstance()
	let accountRepository: ReturnType<typeof getRepository<typeof RepositoryType.ACCOUNT>>
	let userRepository: ReturnType<typeof getRepository<typeof RepositoryType.USER>>
	let userId: string

	beforeAll(async () => {
		await dbInstance.initialize()
		accountRepository = getRepository(RepositoryType.ACCOUNT)
		userRepository = getRepository(RepositoryType.USER)

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
	})

	beforeEach(async () => {
		// Clear the account table before each test
		await accountRepository.delete({})
	})

	afterAll(async () => {
		// Clean up user
		await userRepository.delete({ id: userId })
		await dbInstance.shutdown()
	})

	it('should have no account saved initially', async () => {
		const count = await accountRepository.count()
		expect(count).toBe(0)
	})

	it('should create a bank account', async () => {
		// Generate unique values for this test
		const uniqueId = Date.now().toString()

		// Create an account with bank account data
		const account = new Account()
		account.userId = userId
		account.name = `Test Bank Account ${uniqueId}`
		account.type = 'BANK'
		account.subtype = 'CHECKING_ACCOUNT'
		account.number = `${uniqueId.substring(0, 9)}`
		account.balance = '1000.00'
		account.currencyCode = 'USD'
		account.taxNumber = `${uniqueId}12345`
		account.owner = `Test User ${uniqueId}`

		// Add bank account data
		const bankAccount = new BankAccount()
		bankAccount.transferNumber = '987654321'
		bankAccount.closingBalance = '1000.00'
		account.bankAccount = bankAccount

		// Save the account
		const savedAccount = await accountRepository.save(account)
		expect(savedAccount.id).toBeDefined()

		// Retrieve the account with bank account data
		const retrievedAccount = await accountRepository.findOne({
			where: { id: savedAccount.id },
			relations: ['bankAccount'],
		})

		// Verify the account and bank account data
		expect(retrievedAccount).toBeDefined()
		expect(retrievedAccount?.name).toContain('Test Bank Account')
		expect(retrievedAccount?.type).toBe('BANK')

		// Verify bank account data
		expect(retrievedAccount?.bankAccount).toBeDefined()
		expect(retrievedAccount?.bankAccount?.transferNumber).toBe('987654321')
		expect(retrievedAccount?.bankAccount?.closingBalance).toBe('1000.00')
	})

	it('should create a credit account', async () => {
		// Generate unique values for this test
		const uniqueId = Date.now().toString()

		// Create an account with credit account data
		const account = new Account()
		account.userId = userId
		account.name = `Test Credit Account ${uniqueId}`
		account.type = 'CREDIT'
		account.subtype = 'CREDIT_CARD'
		account.number = `${uniqueId.substring(0, 9)}`
		account.balance = '500.00'
		account.currencyCode = 'USD'
		account.taxNumber = `${uniqueId}12345`
		account.owner = `Test User ${uniqueId}`

		// Add credit account data
		const creditAccount = new CreditAccount()
		creditAccount.level = 'GOLD'
		creditAccount.brand = 'VISA'
		creditAccount.balanceCloseDate = new Date('2023-12-31')
		creditAccount.balanceDueDate = new Date('2024-01-15')
		creditAccount.availableCreditLimit = '5000.00'
		creditAccount.creditLimit = '10000.00'
		creditAccount.isLimitFlexible = false
		creditAccount.balanceForeignCurrency = '0.00'
		creditAccount.minimumPayment = '50.00'
		creditAccount.status = 'ACTIVE'
		creditAccount.holderType = 'INDIVIDUAL'
		account.creditData = creditAccount

		// Save the account
		const savedAccount = await accountRepository.save(account)
		expect(savedAccount.id).toBeDefined()

		// Retrieve the account with credit account data
		const retrievedAccount = await accountRepository.findOne({
			where: { id: savedAccount.id },
			relations: ['creditData'],
		})

		// Verify the account and credit account data
		expect(retrievedAccount).toBeDefined()
		expect(retrievedAccount?.name).toContain('Test Credit Account')
		expect(retrievedAccount?.type).toBe('CREDIT')

		// Verify credit account data
		expect(retrievedAccount?.creditData).toBeDefined()
		expect(retrievedAccount?.creditData?.level).toBe('GOLD')
		expect(retrievedAccount?.creditData?.brand).toBe('VISA')
		expect(retrievedAccount?.creditData?.availableCreditLimit).toBe('5000.00')
		expect(retrievedAccount?.creditData?.creditLimit).toBe('10000.00')
		expect(retrievedAccount?.creditData?.status).toBe('ACTIVE')
	})
})
