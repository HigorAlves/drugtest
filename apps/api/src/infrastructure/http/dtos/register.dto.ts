import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

/**
 * DTO for registering a new user
 * This class defines the structure of the request body for registering a new user
 */
export class RegisterDto {
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
}
