import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import { BankAccount, CreditAccount, User } from '@/postgres/entity'
import type { CurrencyCode } from '@/postgres/utils/mappers'

@Entity({ name: 'accounts' })
export class Account {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column({ type: 'uuid' })
	userId!: string

	@Column({ type: 'varchar', length: 100 })
	name!: string

	@Column({ type: 'varchar', length: 50 })
	type!: 'BANK' | 'CREDIT' // BANK or CREDIT

	@Column({ type: 'varchar', length: 50, nullable: true })
	subtype!: string | null // CHECKING_ACCOUNT, CREDIT_CARD, etc.

	@Column({ type: 'varchar', length: 50, nullable: true })
	number!: string | null // Account/card number

	@Column({ type: 'decimal', precision: 15, scale: 2, default: 0.0 })
	balance!: string

	@Column({ type: 'varchar', length: 10 })
	currencyCode!: CurrencyCode

	@Column({ type: 'varchar', length: 14, nullable: true })
	taxNumber!: string | null

	@Column({ type: 'varchar', length: 255, nullable: true })
	owner!: string | null

	@CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
	createdAt!: Date

	@UpdateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
	updatedAt!: Date

	@ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user!: User

	@OneToOne(() => BankAccount, (bankData) => bankData.account, { cascade: true })
	bankAccount: BankAccount | null = null

	@OneToOne(() => CreditAccount, (creditData) => creditData.account, { cascade: true })
	creditData: CreditAccount | null = null
}
