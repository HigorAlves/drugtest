import { ConflictException, Injectable, Inject } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

import { User, UserRole } from '../../domain/models/user.model'
import { UserRepository } from '../../domain/repositories/user.repository'

/**
 * Use case for creating a new user
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class CreateUserUseCase {
	constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

	/**
	 * Execute the use case
	 * @param username - Username
	 * @param password - Password (will be hashed)
	 * @param role - User role
	 * @returns Promise<User> - Created user
	 * @throws ConflictException - If username already exists
	 */
	async execute(username: string, password: string, role: UserRole = UserRole.USER): Promise<User> {
		// Check if username already exists
		const existingUser = await this.userRepository.findByUsername(username)
		if (existingUser) {
			throw new ConflictException('Username already exists')
		}

		// Hash password
		const passwordHash = await bcrypt.hash(password, 10)

		// Create new user
		const newUser = new User({
			id: uuidv4(),
			username,
			passwordHash,
			role,
		})

		// Save user to repository
		return this.userRepository.create(newUser)
	}
}
