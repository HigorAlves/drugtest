import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class RegisterDto {
	@ApiProperty({
		description: 'The username of the user',
		example: 'john.doe',
		minLength: 3,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	username: string

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
