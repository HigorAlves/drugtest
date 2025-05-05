import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import {
	CreateUserUseCase,
	DeleteUserUseCase,
	FindAllUsersUseCase,
	FindUserByIdUseCase,
	UpdateUserUseCase,
} from '../../../application/users'
import { User, UserRole } from '../../../domain/models/user.model'
import { JwtAuthGuard, RolesGuard, Roles } from '../../security'
import { CreateUserDto, UpdateUserDto } from '../dtos'

/**
 * Controller for user-related endpoints
 * This class adapts HTTP requests to application use cases
 */
@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(
		private readonly findAllUsersUseCase: FindAllUsersUseCase,
		private readonly findUserByIdUseCase: FindUserByIdUseCase,
		private readonly createUserUseCase: CreateUserUseCase,
		private readonly updateUserUseCase: UpdateUserUseCase,
		private readonly deleteUserUseCase: DeleteUserUseCase
	) {}

	/**
	 * Get all users
	 * @returns Promise<User[]> - List of users
	 */
	@ApiOperation({ summary: 'Get all users' })
	@ApiResponse({ status: 200, description: 'Return all users', type: [User] })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.USER)
	@Get()
	async findAll(): Promise<User[]> {
		return this.findAllUsersUseCase.execute()
	}

	/**
	 * Get a user by ID
	 * @param id - User ID
	 * @returns Promise<User> - User
	 */
	@ApiOperation({ summary: 'Get a user by ID' })
	@ApiResponse({ status: 200, description: 'Return the user', type: User })
	@ApiResponse({ status: 404, description: 'User not found' })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@Get(':id')
	async findOne(@Param('id') id: string): Promise<User> {
		return this.findUserByIdUseCase.execute(id)
	}

	/**
	 * Create a new user
	 * @param createUserDto - Data for creating a user
	 * @returns Promise<User> - Created user
	 */
	@ApiOperation({ summary: 'Create a new user' })
	@ApiResponse({ status: 201, description: 'The user has been created', type: User })
	@ApiResponse({ status: 409, description: 'Username already exists' })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@Post()
	async create(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.createUserUseCase.execute(createUserDto.username, createUserDto.password, createUserDto.role)
	}

	/**
	 * Update a user
	 * @param id - User ID
	 * @param updateUserDto - Data for updating a user
	 * @returns Promise<User> - Updated user
	 */
	@ApiOperation({ summary: 'Update a user' })
	@ApiResponse({ status: 200, description: 'The user has been updated', type: User })
	@ApiResponse({ status: 404, description: 'User not found' })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@Put(':id')
	async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
		return this.updateUserUseCase.execute(id, {
			username: updateUserDto.username,
			passwordHash: updateUserDto.password, // Will be hashed in the use case
			role: updateUserDto.role,
		})
	}

	/**
	 * Delete a user
	 * @param id - User ID
	 * @returns Promise<void>
	 */
	@ApiOperation({ summary: 'Delete a user' })
	@ApiResponse({ status: 200, description: 'The user has been deleted' })
	@ApiResponse({ status: 404, description: 'User not found' })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@Delete(':id')
	async remove(@Param('id') id: string): Promise<void> {
		return this.deleteUserUseCase.execute(id)
	}
}
