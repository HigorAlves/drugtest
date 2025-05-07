import { User, UserSchema, UserRole } from './user.model';
import { ZodError } from 'zod';

describe('User Model', () => {
  describe('constructor', () => {
    it('should create a valid User instance with ADMIN role', () => {
      // Arrange
      const userData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        username: 'admin',
        passwordHash: 'hashed_password',
        role: UserRole.ADMIN,
      };

      // Act
      const user = new User(userData);

      // Assert
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(userData.id);
      expect(user.username).toBe(userData.username);
      expect(user.passwordHash).toBe(userData.passwordHash);
      expect(user.role).toBe(UserRole.ADMIN);
    });

    it('should create a valid User instance with USER role', () => {
      // Arrange
      const userData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        username: 'user',
        passwordHash: 'hashed_password',
        role: UserRole.USER,
      };

      // Act
      const user = new User(userData);

      // Assert
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(userData.id);
      expect(user.username).toBe(userData.username);
      expect(user.passwordHash).toBe(userData.passwordHash);
      expect(user.role).toBe(UserRole.USER);
    });

    it('should throw error when creating with invalid data', () => {
      // Arrange
      const invalidData = {
        id: 'not-a-uuid',
        username: 'ab', // too short
        passwordHash: '',
        role: 'GUEST' as UserRole, // invalid role
      };

      // Act & Assert
      expect(() => new User(invalidData)).toThrow(ZodError);
    });
  });

  describe('validate', () => {
    it('should validate a complete user object', () => {
      // Arrange
      const userData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        passwordHash: 'hashed_password',
        role: UserRole.USER,
      };

      // Act
      const result = User.validate(userData);

      // Assert
      expect(result).toEqual(userData);
    });

    it('should throw error when validating invalid data', () => {
      // Arrange
      const invalidData = {
        id: 'not-a-uuid',
        username: 'ab', // too short
        passwordHash: '',
        role: 'GUEST' as UserRole, // invalid role
      };

      // Act & Assert
      expect(() => User.validate(invalidData)).toThrow(ZodError);
    });
  });

  describe('validatePartial', () => {
    it('should validate a partial user object', () => {
      // Arrange
      const partialData = {
        username: 'testuser',
        role: UserRole.ADMIN,
      };

      // Act
      const result = User.validatePartial(partialData);

      // Assert
      expect(result).toEqual(partialData);
    });

    it('should throw error when validating invalid partial data', () => {
      // Arrange
      const invalidPartialData = {
        username: 'ab', // too short
        role: 'GUEST' as UserRole, // invalid role
      };

      // Act & Assert
      expect(() => User.validatePartial(invalidPartialData)).toThrow(ZodError);
    });
  });
});