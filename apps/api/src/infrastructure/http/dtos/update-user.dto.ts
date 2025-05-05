import { UserRole } from '../../../domain/models/user.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * DTO for updating a user
 * This class defines the structure of the request body for updating a user
 */
export class UpdateUserDto {
  /**
   * The username of the user
   * @example "john.doe"
   */
  @ApiProperty({
    description: 'The username of the user',
    example: 'john.doe',
    minLength: 3,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  username?: string;

  /**
   * The password of the user
   * @example "password123"
   */
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    minLength: 6,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  /**
   * The role of the user
   * @example "USER"
   */
  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    example: UserRole.USER,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}