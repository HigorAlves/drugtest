import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Tag, Transaction } from '@/postgres/entity'

@Entity({ name: 'transaction_tags' })
export class TransactionTag {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column('uuid')
	transactionId!: string

	@Column('uuid')
	tagId!: string

	@ManyToOne(() => Transaction, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'transactionId' })
	transaction!: Transaction

	@ManyToOne(() => Tag, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'tagId' })
	tag!: Tag
}
