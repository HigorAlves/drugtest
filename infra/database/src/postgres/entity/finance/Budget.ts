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

import { BudgetCategoryLink, Category, User } from '@/postgres/entity'

export enum BudgetPeriod {
	MONTHLY = 'monthly',
	WEEKLY = 'weekly',
	CUSTOM = 'custom',
}

@Entity({ name: 'budgets' })
export class Budget {
	@PrimaryGeneratedColumn('uuid')
	id: string | undefined

	@Column({ type: 'uuid' })
	userId: string | undefined

	@Column({ type: 'uuid' })
	categoryId: string | undefined

	@Column({
		type: 'decimal',
		precision: 10,
		scale: 2,
	})
	amount: string | undefined

	@Column({
		type: 'varchar',
		length: 10,
		enum: BudgetPeriod,
	})
	period: BudgetPeriod | undefined

	@Column({ type: 'timestamp' })
	startDate: Date | undefined

	@Column({ type: 'timestamp' })
	endDate: Date | undefined

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date | undefined

	@UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	updatedAt: Date | undefined

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user: User | undefined

	@ManyToOne(() => Category, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'categoryId' })
	category: Category | undefined

	@OneToMany(() => BudgetCategoryLink, (link) => link.budget, { cascade: true })
	categoryLinks: BudgetCategoryLink[] | undefined
}
