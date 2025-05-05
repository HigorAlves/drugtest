import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '@/postgres/entity'

@Entity({ name: 'subscriptions' })
export class Subscription {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column('uuid')
	userId!: string

	@Column('varchar', { length: 255 })
	serviceName!: string // e.g., "Netflix", "Spotify"

	@Column('decimal', { precision: 15, scale: 2 })
	monthlyCost!: string

	@Column('varchar', { length: 10 })
	currencyCode!: string

	@Column('timestamp')
	nextBillingDate!: Date

	@Column('boolean', { default: true })
	active!: boolean

	@CreateDateColumn()
	createdAt!: Date

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user!: User
}
