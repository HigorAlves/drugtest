import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Transaction } from '@/postgres/entity'

@Entity({ name: 'credit_card_transaction_metadata' })
export class CreditCardTransactionMetadata {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@OneToOne(() => Transaction, (transaction) => transaction.creditCardMetadata, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'transactionId' })
	transaction!: Transaction

	@Column({ type: 'uuid' })
	transactionId!: string

	@Column({ type: 'int' })
	installmentNumber!: number

	@Column({ type: 'int' })
	totalInstallments!: number

	@Column({ type: 'decimal', precision: 15, scale: 2 })
	totalAmount!: string
}
