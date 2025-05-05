import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../../domain/models/user.model';
import { UserRepository } from '../../domain/repositories/user.repository';

/**
 * Use case for finding a user by ID
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class FindUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Execute the use case
   * @param id - User ID
   * @returns Promise<User> - User
   * @throws NotFoundException - If user is not found
   */
  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}