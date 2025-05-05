import { Repository } from 'typeorm'

import { getTransactionManager } from '@/postgres/context/TransactionContext'
import { entityMap, repositoryMap, RepositoryType } from '@/postgres/repository'
import { EntityMapping } from '@/postgres/repository'

export function InjectRepository<K extends RepositoryType>(repoType: K): PropertyDecorator {
	return (target: object, propertyKey: string | symbol) => {
		Object.defineProperty(target, propertyKey, {
			get(): Repository<EntityMapping[K]> {
				const transactionalManager = getTransactionManager()
				if (transactionalManager) {
					return transactionalManager.getRepository(entityMap[repoType]) as Repository<EntityMapping[K]>
				}
				return repositoryMap[repoType] as Repository<EntityMapping[K]>
			},
			enumerable: true,
			configurable: false,
		})
	}
}
