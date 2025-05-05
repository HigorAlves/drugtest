import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '@/postgres/entity'

@Entity({ name: 'reports' })
export class Report {
	@PrimaryGeneratedColumn('uuid')
	id: string | undefined

	@Column({ type: 'uuid' })
	userId: string | undefined

	@Column({ type: 'varchar', length: 255, default: null })
	type: string | null | undefined

	@Column({ type: 'json' })
	data: Record<string, unknown> | undefined

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	generatedAt: Date = new Date()

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user: User | undefined
}
