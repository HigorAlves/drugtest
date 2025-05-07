import { Test, TestingModule } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'

import { User, UserRole } from '../../domain/models/user.model'
import { UserRepository } from '../../domain/repositories/user.repository'
import { ValidateUserUseCase } from './validate-user.use-case'

// Mock bcrypt
jest.mock('bcrypt')

describe('ValidateUserUseCase', () => {
	let useCase: ValidateUserUseCase
	let userRepository: UserRepository

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ValidateUserUseCase,
				{
					provide: 'UserRepository',
					useValue: {
						findByUsername: jest.fn(),
					},
				},
			],
		}).compile()

		useCase = module.get<ValidateUserUseCase>(ValidateUserUseCase)
		userRepository = module.get<UserRepository>('UserRepository')
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should be defined', () => {
		expect(useCase).toBeDefined()
	})

	describe('execute', () => {
		const mockUser: User = {
			id: '1',
			username: 'testuser',
			passwordHash: 'hashed_password',
			role: UserRole.USER,
		}

		it('should return user without password hash when credentials are valid', async () => {
			// Arrange
			const username = 'testuser'
			const password = 'password123'

			jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(mockUser)
			;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

			// Act
			const result = await useCase.execute(username, password)

			// Assert
			expect(result).toEqual({
				id: '1',
				username: 'testuser',
				role: UserRole.USER,
			})
			expect(userRepository.findByUsername).toHaveBeenCalledWith(username)
			expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.passwordHash)
		})

		it('should return null when user is not found', async () => {
			// Arrange
			const username = 'nonexistentuser'
			const password = 'password123'

			jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(undefined)

			// Act
			const result = await useCase.execute(username, password)

			// Assert
			expect(result).toBeNull()
			expect(userRepository.findByUsername).toHaveBeenCalledWith(username)
			expect(bcrypt.compare).not.toHaveBeenCalled()
		})

		it('should return null when password is invalid', async () => {
			// Arrange
			const username = 'testuser'
			const password = 'wrongpassword'

			jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(mockUser)
			;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

			// Act
			const result = await useCase.execute(username, password)

			// Assert
			expect(result).toBeNull()
			expect(userRepository.findByUsername).toHaveBeenCalledWith(username)
			expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.passwordHash)
		})
	})
})
