import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { User } from '../../domain/models/user.model'
import { UserRepository } from '../../domain/repositories/user.repository'

/**
 * Use case for updating a user
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class UpdateUserUseCase {
	constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

	/**
	 * Execute the use case
	 * @param id - User ID
	 * @param userData - Updated user data
	 * @returns Promise<User> - Updated user
	 * @throws NotFoundException - If user is not found
	 */
	async execute(id: string, userData: Partial<User>): Promise<User> {
		// Check if user exists
		const existingUser = await this.userRepository.findById(id)
		if (!existingUser) {
			throw new NotFoundException('User not found')
		}

		// Hash password if provided
		if (userData.passwordHash) {
			userData.passwordHash = await bcrypt.hash(userData.passwordHash, 10)
		}

		// Update user
		return this.userRepository.update(id, userData)
	}
}
