/* eslint-disable @typescript-eslint/no-explicit-any */
import { setTransactionManager } from '@/postgres/context/TransactionContext'
import { AppDataSource } from '@/postgres/data-source'

export function TransactionalClass(): ClassDecorator {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	return function <TFunction extends Function>(target: TFunction): TFunction {
		const targetConstructor = target as unknown as { new (...args: any[]): any }

		const newConstructor: { new (...args: any[]): any } = class extends targetConstructor {
			constructor(...args: any[]) {
				super(...args)
				const propertyNames = Object.getOwnPropertyNames(targetConstructor.prototype)
				for (const propertyName of propertyNames) {
					if (propertyName === 'constructor') continue
					const originalMethod = (this as any)[propertyName]
					if (typeof originalMethod === 'function') {
						;(this as any)[propertyName] = async (...methodArgs: any[]) => {
							const queryRunner = AppDataSource.createQueryRunner()
							await queryRunner.connect()
							await queryRunner.startTransaction()

							setTransactionManager(queryRunner.manager)
							try {
								const result = await originalMethod.apply(this, methodArgs)
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
					}
				}
			}
		}

		return newConstructor as unknown as TFunction
	}
}
