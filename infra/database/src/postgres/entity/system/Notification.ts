import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'notifications' })
export class Notification {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column('uuid')
	userId!: string

	@Column('varchar', { length: 255 })
	title!: string

	@Column('text')
	message!: string

	@Column('boolean', { default: false })
	read!: boolean

	@CreateDateColumn()
	createdAt!: Date
}
