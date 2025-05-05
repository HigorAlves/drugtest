import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import { Transaction, User } from '@/postgres/entity'
import { CategoryType } from '@/postgres/utils/openFinanceCategories.mapper'

@Entity({ name: 'categories' })
export class Category {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column({ type: 'varchar', length: 20, unique: true })
	name!: string

	@Column({ type: 'varchar', length: 20, unique: true })
	color!: string

	@Column({ type: 'varchar', length: 20, unique: true })
	icon!: string

	@Column({ type: 'varchar', length: 20, nullable: true, unique: true })
	openFinanceId?: string | null

	@Column({ type: 'varchar', length: 255 })
	description!: string

	@Column({ type: 'varchar', length: 255 })
	descriptionTranslated!: string

	@Column({ type: 'enum', enum: CategoryType })
	type!: CategoryType

	@Column({ type: 'varchar', length: 255 })
	level1!: string // Income, Transfers, etc.

	@Column({ type: 'varchar', length: 255, nullable: true })
	level2?: string | null // Salary, Transfer - TED, etc.

	@Column({ type: 'varchar', length: 255, nullable: true })
	level3?: string | null // Sub-sub-category (e.g., Internet, if exists)

	@ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
	@JoinColumn({ name: 'userId' })
	user?: User | null

	@Column({ type: 'uuid', nullable: true })
	userId?: string | null

	@OneToMany(() => Transaction, (transaction) => transaction.linkedCategory)
	transactions?: Transaction[]

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt!: Date

	@UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	updatedAt!: Date
}
