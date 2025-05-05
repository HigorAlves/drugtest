import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Investment } from '@/postgres/entity'

@Entity({ name: 'investment_transactions' })
export class InvestmentTransaction {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column('uuid')
	investmentId!: string

	@Column('decimal', { precision: 15, scale: 2 })
	amount!: string

	@Column('varchar', { length: 10 })
	currencyCode!: string

	@Column('timestamp')
	date!: Date

	@Column('varchar', { length: 50 })
	transactionType!: 'buy' | 'sell'

	@ManyToOne(() => Investment, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'investmentId' })
	investment!: Investment
}
