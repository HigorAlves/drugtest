import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '@/postgres/entity'

@Entity('stripe_payment_intents')
export class StripePaymentIntent {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ unique: true, type: 'varchar', length: 255 })
	stripePaymentIntentId!: string

	@ManyToOne(() => User, (user) => user.paymentIntents, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user!: User

	@Column({ type: 'int' })
	amount!: number

	@Column({ type: 'varchar', length: 255 })
	currency!: string

	@Column({ type: 'varchar', length: 255 })
	status!: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	paymentMethod: string | null = null

	@Column({ type: 'timestamp' })
	createdAt!: Date
}
