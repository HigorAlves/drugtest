import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '@/postgres/entity'

@Entity('stripe_subscriptions')
export class StripeSubscription {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ unique: true, type: 'varchar', length: 255 })
	stripeSubscriptionId!: string

	@ManyToOne(() => User, (user) => user.subscriptions, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user!: User

	@Column({ nullable: true, type: 'varchar', length: 255 })
	priceId!: string

	@Column({ type: 'varchar', length: 255 })
	status!: string

	@Column({ type: 'timestamp', nullable: true })
	currentPeriodStart!: Date

	@Column({ type: 'timestamp', nullable: true })
	currentPeriodEnd!: Date

	@Column({ default: false, type: 'boolean' })
	cancelAtPeriodEnd!: boolean

	@Column({ type: 'timestamp', nullable: true })
	canceledAt!: Date
}
