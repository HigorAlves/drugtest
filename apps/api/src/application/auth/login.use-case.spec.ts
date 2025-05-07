import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { LoginUseCase } from './login.use-case'
import { User, UserRole } from '../../domain/models/user.model'

describe('LoginUseCase', () => {
	let useCase: LoginUseCase
	let jwtService: JwtService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LoginUseCase,
				{
					provide: JwtService,
					useValue: {
						sign: jest.fn().mockReturnValue('test-token'),
					},
				},
			],
		}).compile()

		useCase = module.get<LoginUseCase>(LoginUseCase)
		jwtService = module.get<JwtService>(JwtService)
	})

	it('should be defined', () => {
		expect(useCase).toBeDefined()
	})

	describe('execute', () => {
		it('should return access token and user info', async () => {
			// Arrange
			const user: Omit<User, 'passwordHash'> = {
				id: '1',
				username: 'testuser',
				role: UserRole.USER,
			}

			// Act
			const result = await useCase.execute(user)

			// Assert
			expect(result).toEqual({
				access_token: 'test-token',
				user: {
					id: '1',
					username: 'testuser',
					role: 'USER',
				},
			})
			expect(jwtService.sign).toHaveBeenCalledWith({
				sub: '1',
				username: 'testuser',
				role: 'USER',
			})
		})
	})
})
