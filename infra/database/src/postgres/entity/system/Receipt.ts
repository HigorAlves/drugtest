import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '@/postgres/entity/identity'
import { Transaction } from '@/postgres/entity/transaction/Transaction'

@Entity({ name: 'receipts' })
export class Receipt {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column('uuid')
	userId!: string

	@Column('uuid', { nullable: true })
	transactionId?: string

	@Column('varchar', { length: 255 })
	merchant!: string

	@Column('decimal', { precision: 15, scale: 2 })
	amount!: string

	@Column('timestamp')
	date!: Date

	@Column('varchar', { length: 255 })
	imageUrl!: string // Where the uploaded receipt image is stored (S3, Firebase, etc.)

	@CreateDateColumn()
	createdAt!: Date

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user!: User

	@ManyToOne(() => Transaction, { onDelete: 'SET NULL' })
	@JoinColumn({ name: 'transactionId' })
	transaction!: Transaction
}
