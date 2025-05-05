import { UserRole } from '@enterprise/domain'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateUserDto {
	@ApiProperty({
		description: 'The username of the user',
		example: 'john.doe',
		minLength: 3,
		required: false,
	})
	@IsString()
	@IsOptional()
	@MinLength(3)
	username?: string

	@ApiProperty({
		description: 'The password of the user',
		example: 'password123',
		minLength: 6,
		required: false,
	})
	@IsString()
	@IsOptional()
	@MinLength(6)
	password?: string

	@ApiProperty({
		description: 'The role of the user',
		enum: UserRole,
		example: UserRole.USER,
		required: false,
	})
	@IsEnum(UserRole)
	@IsOptional()
	role?: UserRole
}
