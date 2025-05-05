import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '@/postgres/entity'

@Entity({ name: 'user_phone_numbers' })
export class UserPhoneNumber {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@ManyToOne(() => User, (user) => user.phoneNumbers, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user!: User

	@Column({ type: 'uuid' })
	userId!: string

	@Column({ type: 'varchar', length: 50 })
	type!: 'personal' | 'work' | 'other'

	@Column({ type: 'varchar', length: 50 })
	value!: string
}
