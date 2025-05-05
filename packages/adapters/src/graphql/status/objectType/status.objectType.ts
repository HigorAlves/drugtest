import { Field, ObjectType } from 'type-graphql'

@ObjectType('Status')
export class Status {
	@Field(() => String, { nullable: true })
	name: string | null = null

	@Field(() => Number, { nullable: true })
	activeConnections: number | null = null
}
