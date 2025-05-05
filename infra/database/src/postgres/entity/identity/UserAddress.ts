import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '@/postgres/entity'

@Entity({ name: 'user_addresses' })
export class UserAddress {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user!: User

	@Column({ type: 'uuid' })
	userId!: string

	@Column({ type: 'varchar', length: 255 })
	fullAddress!: string

	@Column({ type: 'varchar', length: 50 })
	country!: string

	@Column({ type: 'varchar', length: 50 })
	state!: string

	@Column({ type: 'varchar', length: 50 })
	city!: string

	@Column({ type: 'varchar', length: 20 })
	postalCode!: string

	@Column({ type: 'varchar', length: 255 })
	primaryAddress!: string

	@Column({ type: 'varchar', length: 50 })
	type!: 'personal' | 'work'
}
