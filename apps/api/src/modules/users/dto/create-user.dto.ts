import { UserRole } from '@enterprise/domain'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
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

	@ApiProperty({
		description: 'The role of the user',
		enum: UserRole,
		example: UserRole.USER,
	})
	@IsEnum(UserRole)
	role: UserRole
}
