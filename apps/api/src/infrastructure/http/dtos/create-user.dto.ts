import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator'

import { UserRole } from '../../../domain/models/user.model'

/**
 * DTO for creating a user
 * This class defines the structure of the request body for creating a user
 */
export class CreateUserDto {
	/**
	 * The username of the user
	 * @example "john.doe"
	 */
	@ApiProperty({
		description: 'The username of the user',
		example: 'john.doe',
		minLength: 3,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	username: string

	/**
	 * The password of the user
	 * @example "password123"
	 */
	@ApiProperty({
		description: 'The password of the user',
		example: 'password123',
		minLength: 6,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password: string

	/**
	 * The role of the user
	 * @example "USER"
	 */
	@ApiProperty({
		description: 'The role of the user',
		enum: UserRole,
		example: UserRole.USER,
	})
	@IsEnum(UserRole)
	role: UserRole
}
