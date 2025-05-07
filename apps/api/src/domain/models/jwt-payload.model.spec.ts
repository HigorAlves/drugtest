import { JwtPayload } from './jwt-payload.model';
import { UserRole } from './user.model';

describe('JwtPayload Model', () => {
  it('should create a valid JwtPayload object with USER role', () => {
    // Arrange & Act
    const payload: JwtPayload = {
      sub: '123e4567-e89b-12d3-a456-426614174000',
      username: 'testuser',
      role: UserRole.USER,
    };

    // Assert
    expect(payload.sub).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(payload.username).toBe('testuser');
    expect(payload.role).toBe(UserRole.USER);
  });

  it('should create a valid JwtPayload object with ADMIN role', () => {
    // Arrange & Act
    const payload: JwtPayload = {
      sub: '123e4567-e89b-12d3-a456-426614174001',
      username: 'admin',
      role: UserRole.ADMIN,
    };

    // Assert
    expect(payload.sub).toBe('123e4567-e89b-12d3-a456-426614174001');
    expect(payload.username).toBe('admin');
    expect(payload.role).toBe(UserRole.ADMIN);
  });

  it('should allow type checking for JwtPayload properties', () => {
    // This test verifies that TypeScript correctly enforces the JwtPayload interface
    // It doesn't actually run any assertions at runtime, but helps ensure type safety

    // Arrange
    const payload: JwtPayload = {
      sub: '123',
      username: 'user',
      role: UserRole.USER,
    };

    // Act & Assert - These operations should compile without errors
    const userId: string = payload.sub;
    const username: string = payload.username;
    const role: UserRole = payload.role;

    expect(typeof userId).toBe('string');
    expect(typeof username).toBe('string');
    expect(Object.values(UserRole)).toContain(role);
  });
});