import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Category, Transaction } from '@/postgres/entity'

@Entity({ name: 'transaction_splits' })
export class TransactionSplit {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column('uuid')
	transactionId!: string

	@Column('uuid')
	categoryId!: string

	@Column('decimal', { precision: 15, scale: 2 })
	amount!: string

	@ManyToOne(() => Transaction, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'transactionId' })
	transaction!: Transaction

	@ManyToOne(() => Category, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'categoryId' })
	category!: Category
}
