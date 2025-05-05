import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('stripe_webhook_events')
export class StripeWebhookEvent {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ unique: true, type: 'varchar', length: 255 })
	stripeEventId!: string

	@Column({ type: 'varchar', length: 255 })
	eventType!: string

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	receivedAt!: Date

	@Column({ default: false, type: 'boolean' })
	processed!: boolean

	@Column({ type: 'jsonb', nullable: true })
	rawPayload!: object
}
