import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'cash_flow_forecasts' })
export class CashFlowForecast {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column('uuid')
	userId!: string

	@Column('decimal', { precision: 20, scale: 2 })
	projectedBalance!: string

	@Column('timestamp')
	forecastDate!: Date

	@CreateDateColumn()
	createdAt!: Date
}
