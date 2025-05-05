import { setTransactionManager } from '@/postgres/context/TransactionContext'
import { AppDataSource } from '@/postgres/data-source'

export function Transactional(): MethodDecorator {
	return (target, propertyKey, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value

		descriptor.value = async function (...args: unknown[]) {
			const queryRunner = AppDataSource.createQueryRunner()
			await queryRunner.connect()
			await queryRunner.startTransaction()

			setTransactionManager(queryRunner.manager)

			try {
				const result = await originalMethod.apply(this, args)
				await queryRunner.commitTransaction()
				return result
			} catch (error) {
				await queryRunner.rollbackTransaction()
				throw error
			} finally {
				setTransactionManager(null)
				await queryRunner.release()
			}
		}

		return descriptor
	}
}
