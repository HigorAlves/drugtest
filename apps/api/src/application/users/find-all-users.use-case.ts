import { Inject, Injectable } from '@nestjs/common'

import { User } from '../../domain/models/user.model'
import { UserRepository } from '../../domain/repositories/user.repository'

/**
 * Use case for finding all users
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class FindAllUsersUseCase {
	constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

	/**
	 * Execute the use case
	 * @returns Promise<User[]> - List of users
	 */
	async execute(): Promise<User[]> {
		return this.userRepository.findAll()
	}
}
