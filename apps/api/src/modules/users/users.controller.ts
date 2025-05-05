import { User, UserRole } from '@enterprise/domain'
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { Roles } from '../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({ summary: 'Get all users' })
	@ApiResponse({ status: 200, description: 'Return all users', type: [User] })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.USER)
	@Get()
	async findAll(): Promise<User[]> {
		// In a real app, we would paginate this
		return this.usersService['users']
	}

	@ApiOperation({ summary: 'Get a user by ID' })
	@ApiResponse({ status: 200, description: 'Return the user', type: User })
	@ApiResponse({ status: 404, description: 'User not found' })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@Get(':id')
	async findOne(@Param('id') id: string): Promise<User> {
		const user = await this.usersService.findById(id)
		if (!user) {
			throw new Error('User not found')
		}
		return user
	}

	@ApiOperation({ summary: 'Create a new user' })
	@ApiResponse({ status: 201, description: 'The user has been created', type: User })
	@ApiResponse({ status: 409, description: 'Username already exists' })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@Post()
	async create(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.usersService.create(createUserDto.username, createUserDto.password, createUserDto.role)
	}

	@ApiOperation({ summary: 'Update a user' })
	@ApiResponse({ status: 200, description: 'The user has been updated', type: User })
	@ApiResponse({ status: 404, description: 'User not found' })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@Put(':id')
	async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
		return this.usersService.update(id, {
			username: updateUserDto.username,
			passwordHash: updateUserDto.password, // Will be hashed in the service
			role: updateUserDto.role,
		})
	}

	@ApiOperation({ summary: 'Delete a user' })
	@ApiResponse({ status: 200, description: 'The user has been deleted' })
	@ApiResponse({ status: 404, description: 'User not found' })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@Delete(':id')
	async remove(@Param('id') id: string): Promise<void> {
		return this.usersService.remove(id)
	}
}
