import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '@/postgres/entity'

@Entity({ name: 'user_emails' })
export class UserEmail {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@ManyToOne(() => User, (user) => user.emails, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user!: User

	@Column({ type: 'uuid' })
	userId!: string

	@Column({ type: 'varchar', length: 50 })
	type!: 'personal' | 'work' | 'other'

	@Column({ type: 'varchar', length: 255 })
	value!: string
}
