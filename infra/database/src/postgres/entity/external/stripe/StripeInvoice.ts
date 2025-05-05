import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '@/postgres/entity'

@Entity('stripe_invoices')
export class StripeInvoice {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ unique: true, type: 'varchar', length: 255 })
	stripeInvoiceId!: string

	@ManyToOne(() => User, (user) => user.invoices, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user!: User

	@Column({ type: 'int' })
	amountDue!: number

	@Column({ type: 'varchar', length: 255 })
	currency!: string

	@Column({ type: 'varchar', length: 255 })
	status!: string

	@Column({ type: 'text', nullable: true })
	hostedInvoiceUrl!: string

	@Column({ type: 'timestamp' })
	createdAt!: Date
}
