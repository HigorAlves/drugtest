import { EntityManager } from 'typeorm'

let currentEntityManager: EntityManager | null = null

export function setTransactionManager(manager: EntityManager | null): void {
	currentEntityManager = manager
}

export function getTransactionManager(): EntityManager | null {
	return currentEntityManager
}
