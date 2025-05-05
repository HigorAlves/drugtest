import { Column, Entity, PrimaryColumn } from 'typeorm'

import { User as DomainUser, UserRole } from '../../../domain/models/user.model'

@Entity('users')
export class UserEntity {
	@PrimaryColumn()
	id: string

	@Column({ length: 100, unique: true })
	username: string

	@Column()
	passwordHash: string

	@Column({
		type: 'enum',
		enum: UserRole,
		default: UserRole.USER,
	})
	role: UserRole

	// Convert from domain entity to TypeORM entity
	static fromDomain(user: DomainUser): UserEntity {
		const entity = new UserEntity()
		entity.id = user.id
		entity.username = user.username
		entity.passwordHash = user.passwordHash
		entity.role = user.role
		return entity
	}

	// Convert from TypeORM entity to domain entity
	toDomain(): DomainUser {
		return new DomainUser({
			id: this.id,
			username: this.username,
			passwordHash: this.passwordHash,
			role: this.role,
		})
	}
}
