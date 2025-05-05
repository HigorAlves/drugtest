import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

enum Action {
	CREATE = 'create',
	UPDATE = 'update',
	DELETE = 'delete',
}

enum Subject {
	USER = 'user',
}

@Entity({ name: 'audit_logs' })
export class AuditLog {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column('uuid')
	userId!: string

	@Column('enum', { enum: Action })
	action!: string

	@Column('enum', { enum: Subject })
	subject!: string

	@Column('json')
	details!: Record<string, unknown>

	@CreateDateColumn()
	createdAt!: Date
}
