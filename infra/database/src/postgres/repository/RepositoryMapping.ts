import { Repository } from 'typeorm'

import { AppDataSource } from '@/postgres/data-source'
import { Account } from '@/postgres/entity/account/Account'
import { Category } from '@/postgres/entity/account/Category'
import { Budget } from '@/postgres/entity/finance/Budget'
import { Report } from '@/postgres/entity/finance/Report'
import { User } from '@/postgres/entity/identity/User'
import { Transaction } from '@/postgres/entity/transaction/Transaction'

export enum RepositoryType {
	USER = 'USER',
	ACCOUNT = 'ACCOUNT',
	BUDGET = 'BUDGET',
	CATEGORY = 'CATEGORY',
	REPORT = 'REPORT',
	TRANSACTION = 'TRANSACTION',
}

export interface EntityMapping {
	[RepositoryType.USER]: User
	[RepositoryType.ACCOUNT]: Account
	[RepositoryType.BUDGET]: Budget
	[RepositoryType.CATEGORY]: Category
	[RepositoryType.REPORT]: Report
	[RepositoryType.TRANSACTION]: Transaction
}

export interface RepositoryMapping {
	[RepositoryType.USER]: Repository<User>
	[RepositoryType.ACCOUNT]: Repository<Account>
	[RepositoryType.BUDGET]: Repository<Budget>
	[RepositoryType.CATEGORY]: Repository<Category>
	[RepositoryType.REPORT]: Repository<Report>
	[RepositoryType.TRANSACTION]: Repository<Transaction>
}

// Use a function to get repositories only when needed, after AppDataSource is initialized
export const getRepository = <T extends RepositoryType>(type: T): RepositoryMapping[T] => {
	switch (type) {
		case RepositoryType.USER:
			return AppDataSource.getRepository(User) as RepositoryMapping[T]
		case RepositoryType.ACCOUNT:
			return AppDataSource.getRepository(Account) as RepositoryMapping[T]
		case RepositoryType.BUDGET:
			return AppDataSource.getRepository(Budget) as RepositoryMapping[T]
		case RepositoryType.CATEGORY:
			return AppDataSource.getRepository(Category) as RepositoryMapping[T]
		case RepositoryType.REPORT:
			return AppDataSource.getRepository(Report) as RepositoryMapping[T]
		case RepositoryType.TRANSACTION:
			return AppDataSource.getRepository(Transaction) as RepositoryMapping[T]
		default:
			throw new Error(`Repository type ${type} not found`)
	}
}

export const repositoryMap = {
	get [RepositoryType.USER]() {
		return AppDataSource.getRepository(User)
	},
	get [RepositoryType.ACCOUNT]() {
		return AppDataSource.getRepository(Account)
	},
	get [RepositoryType.BUDGET]() {
		return AppDataSource.getRepository(Budget)
	},
	get [RepositoryType.CATEGORY]() {
		return AppDataSource.getRepository(Category)
	},
	get [RepositoryType.REPORT]() {
		return AppDataSource.getRepository(Report)
	},
	get [RepositoryType.TRANSACTION]() {
		return AppDataSource.getRepository(Transaction)
	},
}

export const entityMap: { [K in RepositoryType]: { new (...args: never[]): EntityMapping[K] } } = {
	[RepositoryType.USER]: User,
	[RepositoryType.ACCOUNT]: Account,
	[RepositoryType.BUDGET]: Budget,
	[RepositoryType.CATEGORY]: Category,
	[RepositoryType.REPORT]: Report,
	[RepositoryType.TRANSACTION]: Transaction,
}
