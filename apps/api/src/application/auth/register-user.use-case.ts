import { Injectable } from '@nestjs/common';

import { User, UserRole } from '../../domain/models/user.model';
import { CreateUserUseCase } from '../users/create-user.use-case';

/**
 * Use case for registering a new user
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  /**
   * Execute the use case
   * @param username - Username
   * @param password - Password
   * @returns Promise<Omit<User, 'passwordHash'>> - Created user without password hash
   */
  async execute(username: string, password: string): Promise<Omit<User, 'passwordHash'>> {
    // Create a new user with USER role by default
    const user = await this.createUserUseCase.execute(username, password, UserRole.USER);

    // Return user without password hash
    const { passwordHash, ...result } = user;
    return result;
  }
}