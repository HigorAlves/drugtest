import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserUseCase } from './register-user.use-case';
import { CreateUserUseCase } from '../users';
import { User, UserRole } from '../../domain/models/user.model';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
        {
          provide: CreateUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should register a new user with USER role', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'password123';
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        passwordHash: 'hashed_password',
        role: UserRole.USER,
      };
      
      jest.spyOn(createUserUseCase, 'execute').mockResolvedValue(mockUser);

      // Act
      const result = await useCase.execute(username, password);

      // Assert
      expect(result).toEqual({
        id: '1',
        username: 'testuser',
        role: UserRole.USER,
      });
      expect(createUserUseCase.execute).toHaveBeenCalledWith(
        username,
        password,
        UserRole.USER,
      );
    });
  });
});