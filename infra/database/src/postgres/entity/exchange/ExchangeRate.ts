import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'exchange_rates' })
export class ExchangeRate {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column('varchar', { length: 10 })
	fromCurrency!: string

	@Column('varchar', { length: 10 })
	toCurrency!: string

	@Column('decimal', { precision: 15, scale: 6 })
	rate!: string

	@CreateDateColumn()
	recordedAt!: Date
}
