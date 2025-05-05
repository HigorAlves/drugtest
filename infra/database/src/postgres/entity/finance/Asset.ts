import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '@/postgres/entity'

@Entity({ name: 'assets' })
export class Asset {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column('uuid')
	userId!: string

	@Column('varchar', { length: 255 })
	name!: string // e.g., "Car", "Macbook", "House"

	@Column('decimal', { precision: 20, scale: 2 })
	value!: string

	@CreateDateColumn()
	createdAt!: Date

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user!: User
}
