import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '@/postgres/entity'

@Entity({ name: 'emergency_funds' })
export class EmergencyFund {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column('uuid')
	userId!: string

	@Column('decimal', { precision: 20, scale: 2 })
	targetAmount!: string // e.g., Save 6 months of living expenses

	@Column('decimal', { precision: 20, scale: 2, default: 0 })
	currentAmount!: string

	@CreateDateColumn()
	createdAt!: Date

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user!: User
}
