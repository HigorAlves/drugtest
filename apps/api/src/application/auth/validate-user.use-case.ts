import { Injectable, Inject } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { User } from '../../domain/models/user.model'
import { UserRepository } from '../../domain/repositories/user.repository'

/**
 * Use case for validating a user's credentials
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class ValidateUserUseCase {
	constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

	/**
	 * Execute the use case
	 * @param username - Username
	 * @param password - Password
	 * @returns Promise<Omit<User, 'passwordHash'> | null> - User without password hash if valid, null otherwise
	 */
	async execute(username: string, password: string): Promise<Omit<User, 'passwordHash'> | null> {
		// Find user by username
		const user = await this.userRepository.findByUsername(username)
		if (!user) {
			return null
		}

		// Validate password
		const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
		if (!isPasswordValid) {
			return null
		}

		// Return user without password hash
		const { passwordHash, ...result } = user
		return result
	}
}
