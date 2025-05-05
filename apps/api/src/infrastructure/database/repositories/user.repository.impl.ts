import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from '../../../domain/models/user.model'
import { UserRepository } from '../../../domain/repositories/user.repository'
import { UserEntity } from '../entities'

/**
 * Implementation of the UserRepository interface
 * This class adapts the TypeORM repository to the domain repository interface
 */
@Injectable()
export class UserRepositoryImpl implements UserRepository {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}

	/**
	 * Find all users
	 * @returns Promise<User[]> - List of users
	 */
	async findAll(): Promise<User[]> {
		const userEntities = await this.userRepository.find()
		return userEntities.map((entity) => entity.toDomain())
	}

	/**
	 * Find a user by ID
	 * @param id - User ID
	 * @returns Promise<User | undefined> - User if found, undefined otherwise
	 */
	async findById(id: string): Promise<User | undefined> {
		const userEntity = await this.userRepository.findOne({ where: { id } })
		return userEntity ? userEntity.toDomain() : undefined
	}

	/**
	 * Find a user by username
	 * @param username - Username
	 * @returns Promise<User | undefined> - User if found, undefined otherwise
	 */
	async findByUsername(username: string): Promise<User | undefined> {
		const userEntity = await this.userRepository.findOne({ where: { username } })
		return userEntity ? userEntity.toDomain() : undefined
	}

	/**
	 * Create a new user
	 * @param user - User to create
	 * @returns Promise<User> - Created user
	 */
	async create(user: User): Promise<User> {
		const userEntity = UserEntity.fromDomain(user)
		await this.userRepository.save(userEntity)
		return user
	}

	/**
	 * Update a user
	 * @param id - User ID
	 * @param userData - Updated user data
	 * @returns Promise<User> - Updated user
	 */
	async update(id: string, userData: Partial<User>): Promise<User> {
		const userEntity = await this.userRepository.findOne({ where: { id } })
		if (!userEntity) {
			throw new Error('User not found')
		}

		const updatedEntity = {
			...userEntity,
			...userData,
		}

		await this.userRepository.save(updatedEntity)
		return new User(updatedEntity)
	}

	/**
	 * Delete a user
	 * @param id - User ID
	 * @returns Promise<void>
	 */
	async delete(id: string): Promise<void> {
		const userEntity = await this.userRepository.findOne({ where: { id } })
		if (!userEntity) {
			throw new Error('User not found')
		}

		await this.userRepository.remove(userEntity)
	}
}
