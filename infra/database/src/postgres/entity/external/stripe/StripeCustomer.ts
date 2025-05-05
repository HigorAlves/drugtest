import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '@/postgres/entity'

@Entity('stripe_customers')
export class StripeCustomer {
	@PrimaryGeneratedColumn()
	id!: number

	@ManyToOne(() => User, (user) => user.stripeCustomer, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user!: User

	@Column({ unique: true, type: 'varchar', length: 255 })
	stripeCustomerId!: string

	@Column({ nullable: true, type: 'varchar', length: 255 })
	defaultPaymentMethod!: string
}
