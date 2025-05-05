import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '@/postgres/entity'

@Entity({ name: 'shared_expenses' })
export class SharedExpense {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column('uuid')
	userId!: string

	@Column('varchar', { length: 255 })
	description!: string // e.g., "Dinner bill", "Rent"

	@Column('decimal', { precision: 15, scale: 2 })
	totalAmount!: string

	@Column('varchar', { length: 255 })
	participants!: string // Could be a simple CSV: "John,Anna,Mike"

	@Column('decimal', { precision: 15, scale: 2 })
	userShare!: string

	@Column('boolean', { default: false })
	settled!: boolean

	@CreateDateColumn()
	createdAt!: Date

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user!: User
}
