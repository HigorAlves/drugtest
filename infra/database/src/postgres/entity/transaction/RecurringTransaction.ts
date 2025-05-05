import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import { Account, User } from '@/postgres/entity'

export enum RecurrencePeriod {
	WEEKLY = 'weekly',
	MONTHLY = 'monthly',
	YEARLY = 'yearly',
}

@Entity({ name: 'recurring_transactions' })
export class RecurringTransaction {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column('uuid')
	userId!: string

	@Column('uuid')
	accountId!: string

	@Column('varchar')
	description!: string

	@Column('decimal', { precision: 15, scale: 2 })
	amount!: string

	@Column('varchar', { length: 10 })
	currencyCode!: string

	@Column('enum', { enum: RecurrencePeriod })
	recurrence!: RecurrencePeriod

	@Column('timestamp')
	nextDueDate!: Date

	@Column('timestamp', { nullable: true })
	endDate?: Date

	@CreateDateColumn()
	createdAt!: Date

	@UpdateDateColumn()
	updatedAt!: Date

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user!: User

	@ManyToOne(() => Account, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'accountId' })
	account!: Account
}
