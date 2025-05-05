import { User, UserRole } from '@enterprise/domain'
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { USER_REPOSITORY } from '../database/constants'
import { UserEntity } from '../database/entity'

@Injectable()
export class UsersService {
	constructor(
		@Inject(USER_REPOSITORY)
		private userRepository: Repository<UserEntity>
	) {
		// Initialize default users if they don't exist
		this.initializeDefaultUsers()
	}

	private async initializeDefaultUsers() {
		const adminExists = await this.findOne('admin')
		const userExists = await this.findOne('user')

		if (!adminExists) {
			await this.create('admin', 'admin', UserRole.ADMIN)
		}

		if (!userExists) {
			await this.create('user', 'user', UserRole.USER)
		}
	}

	async findOne(username: string): Promise<User | undefined> {
		const userEntity = await this.userRepository.findOne({ where: { username } })
		return userEntity ? userEntity.toDomain() : undefined
	}

	async findById(id: string): Promise<User | undefined> {
		const userEntity = await this.userRepository.findOne({ where: { id } })
		return userEntity ? userEntity.toDomain() : undefined
	}

	async create(username: string, password: string, role: UserRole = UserRole.USER): Promise<User> {
		const existingUser = await this.findOne(username)
		if (existingUser) {
			throw new ConflictException('Username already exists')
		}

		const passwordHash = await bcrypt.hash(password, 10)
		const newUser = new User({
			id: uuidv4(),
			username,
			passwordHash,
			role,
		})

		const userEntity = UserEntity.fromDomain(newUser)
		await this.userRepository.save(userEntity)

		return newUser
	}

	async update(id: string, data: Partial<User>): Promise<User> {
		const userEntity = await this.userRepository.findOne({ where: { id } })
		if (!userEntity) {
			throw new NotFoundException('User not found')
		}

		if (data.passwordHash) {
			data.passwordHash = await bcrypt.hash(data.passwordHash, 10)
		}

		const updatedEntity = {
			...userEntity,
			...data,
		}

		User.validatePartial(updatedEntity)
		await this.userRepository.save(updatedEntity)

		return updatedEntity
	}

	async remove(id: string): Promise<void> {
		const userEntity = await this.userRepository.findOne({ where: { id } })
		if (!userEntity) {
			throw new NotFoundException('User not found')
		}

		await this.userRepository.remove(userEntity)
	}
}
