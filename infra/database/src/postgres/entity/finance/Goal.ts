import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import { User } from '@/postgres/entity'

export enum GoalType {
	SAVING = 'saving',
	SPENDING_LIMIT = 'spending_limit',
	INVESTMENT = 'investment',
}

export enum GoalStatus {
	ACTIVE = 'active',
	COMPLETED = 'completed',
	CANCELLED = 'cancelled',
}

@Entity({ name: 'goals' })
export class Goal {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column({ type: 'uuid' })
	userId!: string

	@Column({ type: 'varchar', length: 255 })
	title!: string

	@Column({ type: 'text', nullable: true })
	description?: string

	@Column({ type: 'decimal', precision: 15, scale: 2 })
	targetAmount!: string

	@Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
	currentAmount!: string

	@Column({ type: 'enum', enum: GoalType })
	type!: GoalType

	@Column({ type: 'enum', enum: GoalStatus, default: GoalStatus.ACTIVE })
	status!: GoalStatus

	@Column({ type: 'timestamp', nullable: true })
	startDate!: Date

	@Column({ type: 'timestamp', nullable: true })
	endDate?: Date

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt!: Date

	@UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	updatedAt!: Date

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user!: User
}
