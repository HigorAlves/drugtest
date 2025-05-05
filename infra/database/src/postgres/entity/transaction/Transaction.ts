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

import { User } from '@/postgres/entity'
import { Account, Category, CreditCardTransactionMetadata } from '@/postgres/entity/account'
import type { CurrencyCode } from '@/postgres/utils/mappers'

export enum TransactionStatus {
	POSTED = 'POSTED',
	PENDING = 'PENDING',
}

export enum TransactionFlowType {
	CREDIT = 'CREDIT',
	DEBIT = 'DEBIT',
}

@Entity({ name: 'transactions' })
export class Transaction {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column({ type: 'uuid' })
	userId!: string

	@Column({ type: 'uuid' })
	accountId!: string

	@Column({ type: 'varchar', length: 255 })
	description!: string

	@Column({ type: 'text', nullable: true })
	descriptionRaw?: string

	@Column({ type: 'varchar', length: 10 })
	currencyCode!: CurrencyCode

	@Column({ type: 'decimal', precision: 15, scale: 2 })
	amount!: string

	@Column({ type: 'timestamp' })
	date!: Date

	@Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
	balance?: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	category?: string

	@Column({ type: 'uuid', nullable: true })
	categoryId?: string

	@Column({ type: 'varchar', length: 20 })
	type!: TransactionFlowType

	@Column({ type: 'varchar', length: 20 })
	status!: TransactionStatus

	@Column({ type: 'varchar', length: 100, nullable: true })
	providerCode?: string

	@Column({ type: 'varchar', length: 100, nullable: true })
	providerId?: string

	@Column({ type: 'text', nullable: true })
	notes?: string

	@Column({ type: 'boolean', default: false })
	recurring!: boolean

	@CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
	createdAt!: Date

	@UpdateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
	updatedAt!: Date

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user!: User

	@ManyToOne(() => Account, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'accountId' })
	account!: Account

	@ManyToOne(() => Category, { onDelete: 'SET NULL', nullable: true })
	@JoinColumn({ name: 'categoryId' })
	linkedCategory!: Category | null

	@OneToOne(() => CreditCardTransactionMetadata, (meta) => meta.transaction, { cascade: true, nullable: true })
	creditCardMetadata?: CreditCardTransactionMetadata
}
