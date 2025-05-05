import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Budget, Category } from '@/postgres/entity'

@Entity({ name: 'budget_category_links' })
export class BudgetCategoryLink {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column({ type: 'uuid' })
	budgetId!: string

	@Column({ type: 'uuid' })
	categoryId!: string

	@ManyToOne(() => Budget, (budget) => budget.categoryLinks, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'budgetId' })
	budget!: Budget

	@ManyToOne(() => Category, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'categoryId' })
	category!: Category
}
