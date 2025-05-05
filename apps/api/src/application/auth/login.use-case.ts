import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '../../domain/models/jwt-payload.model';
import { User } from '../../domain/models/user.model';

/**
 * Use case for logging in a user
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class LoginUseCase {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Execute the use case
   * @param user - User without password hash
   * @returns Promise<{ access_token: string; user: Omit<User, 'passwordHash'> }> - JWT token and user info
   */
  async execute(user: Omit<User, 'passwordHash'>): Promise<{ access_token: string; user: Omit<User, 'passwordHash'> }> {
    // Create JWT payload
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    // Generate JWT token
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}
