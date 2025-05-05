import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Loan } from './Loan'

@Entity({ name: 'loan_payments' })
export class LoanPayment {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column('uuid')
	loanId!: string

	@Column('decimal', { precision: 15, scale: 2 })
	amountPaid!: string

	@Column('timestamp')
	paymentDate!: Date

	@CreateDateColumn()
	createdAt!: Date

	@ManyToOne(() => Loan, (loan) => loan.payments, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'loanId' })
	loan!: Loan
}
