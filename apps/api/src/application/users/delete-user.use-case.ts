import { Injectable, NotFoundException, Inject } from '@nestjs/common'

import { UserRepository } from '../../domain/repositories/user.repository'

/**
 * Use case for deleting a user
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class DeleteUserUseCase {
	constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

	/**
	 * Execute the use case
	 * @param id - User ID
	 * @returns Promise<void>
	 * @throws NotFoundException - If user is not found
	 */
	async execute(id: string): Promise<void> {
		// Check if user exists
		const existingUser = await this.userRepository.findById(id)
		if (!existingUser) {
			throw new NotFoundException('User not found')
		}

		// Delete user
		return this.userRepository.delete(id)
	}
}
