import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import { User } from '@/postgres/entity'
import { LoanPayment } from '@/postgres/entity/loan/LoanPayment'

export enum LoanStatus {
	ACTIVE = 'active',
	PAID = 'paid',
	DEFAULTED = 'defaulted',
}

@Entity({ name: 'loans' })
export class Loan {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column('uuid')
	userId!: string

	@Column('varchar', { length: 255 })
	lenderName!: string // who gave the money (could also be who you gave if inverted)

	@Column('decimal', { precision: 15, scale: 2 })
	principalAmount!: string

	@Column('decimal', { precision: 5, scale: 2, default: 0 })
	interestRate?: string // annual interest percentage (optional)

	@Column('int', { nullable: true })
	numberOfInstallments?: number // if it's a monthly fixed plan

	@Column('timestamp')
	startDate!: Date

	@Column('timestamp', { nullable: true })
	endDate?: Date

	@Column('enum', { enum: LoanStatus, default: LoanStatus.ACTIVE })
	status!: LoanStatus

	@CreateDateColumn()
	createdAt!: Date

	@UpdateDateColumn()
	updatedAt!: Date

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user!: User

	@OneToMany(() => LoanPayment, (payment) => payment.loan, { cascade: true })
	payments!: LoanPayment[]
}
