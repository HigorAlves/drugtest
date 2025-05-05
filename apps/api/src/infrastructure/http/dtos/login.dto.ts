import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

/**
 * DTO for logging in a user
 * This class defines the structure of the request body for logging in a user
 */
export class LoginDto {
	/**
	 * The username of the user
	 * @example "john.doe"
	 */
	@ApiProperty({
		description: 'The username of the user',
		example: 'john.doe',
	})
	@IsString()
	@IsNotEmpty()
	username: string

	/**
	 * The password of the user
	 * @example "password123"
	 */
	@ApiProperty({
		description: 'The password of the user',
		example: 'password123',
	})
	@IsString()
	@IsNotEmpty()
	password: string
}
