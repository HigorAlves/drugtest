import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'net_worth_snapshots' })
export class NetWorthSnapshot {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column('uuid')
	userId!: string

	@Column('decimal', { precision: 20, scale: 2 })
	totalAssets!: string

	@Column('decimal', { precision: 20, scale: 2 })
	totalLiabilities!: string

	@Column('decimal', { precision: 20, scale: 2 })
	netWorth!: string

	@CreateDateColumn()
	snapshotDate!: Date
}
