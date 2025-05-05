import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Account } from '@/postgres/entity'

@Entity({ name: 'credit_account_data' })
export class CreditAccount {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@OneToOne(() => Account, (account) => account.creditData, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'accountId' })
	account!: Account

	@Column({ type: 'uuid' })
	accountId!: string

	@Column({ type: 'varchar', length: 50 })
	level!: string

	@Column({ type: 'varchar', length: 50 })
	brand!: string

	@Column({ type: 'timestamp' })
	balanceCloseDate!: Date

	@Column({ type: 'timestamp' })
	balanceDueDate!: Date

	@Column({ type: 'decimal', precision: 15, scale: 2 })
	availableCreditLimit!: string

	@Column({ type: 'decimal', precision: 15, scale: 2 })
	creditLimit!: string

	@Column({ type: 'boolean' })
	isLimitFlexible!: boolean

	@Column({ type: 'decimal', precision: 15, scale: 2 })
	balanceForeignCurrency!: string

	@Column({ type: 'decimal', precision: 15, scale: 2 })
	minimumPayment!: string

	@Column({ type: 'varchar', length: 50 })
	status!: string

	@Column({ type: 'varchar', length: 50 })
	holderType!: string
}
