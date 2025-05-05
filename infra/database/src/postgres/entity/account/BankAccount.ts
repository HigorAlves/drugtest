import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Account } from '@/postgres/entity'

@Entity({ name: 'bank_account_data' })
export class BankAccount {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@OneToOne(() => Account, (account) => account.bankAccount, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'accountId' })
	account!: Account

	@Column({ type: 'uuid' })
	accountId!: string

	@Column({ type: 'varchar', length: 50 })
	transferNumber!: string

	@Column({ type: 'decimal', precision: 15, scale: 2 })
	closingBalance!: string
}
