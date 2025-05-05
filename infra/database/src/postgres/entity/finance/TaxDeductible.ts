import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '@/postgres/entity'

@Entity({ name: 'tax_deductibles' })
export class TaxDeductible {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column('uuid')
	userId!: string

	@Column('varchar', { length: 255 })
	description!: string // e.g., "Home Office Expense", "Donation to charity"

	@Column('decimal', { precision: 15, scale: 2 })
	amount!: string

	@Column('timestamp')
	date!: Date

	@CreateDateColumn()
	createdAt!: Date

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user!: User
}
