import type { Logger } from '@enterprise/logger'
import { InjectLogger } from '@enterprise/logger'
import { Query, Resolver } from 'type-graphql'
import { Inject, Service } from 'typedi'

import { Status } from '@/graphql/status/objectType/status.objectType'

import { RecipeService } from './tt'

@Service()
@Resolver(() => Status)
export class StatusResolver {
	@InjectLogger('StatusResolver')
	private logger!: Logger

	@Inject(() => RecipeService)
	private readonly someService2!: RecipeService

	@Query(() => Status)
	async status() {
		await this.someService2.getAll()

		return {
			name: 'Status',
			activeConnections: 0,
		}
	}
}
