import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import {
	CreateUserUseCase,
	DeleteUserUseCase,
	FindAllUsersUseCase,
	FindUserByIdUseCase,
	UpdateUserUseCase,
} from '../../../application/users'
import { UserEntity } from '../../database/entities'
import { UserRepositoryImpl } from '../../database/repositories/user.repository.impl'
import { UsersController } from '../controllers/users.controller'

/**
 * Module for user-related components
 * This module ties together controllers, use cases, and repositories
 */
@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	controllers: [UsersController],
	providers: [
		// Use cases
		FindAllUsersUseCase,
		FindUserByIdUseCase,
		CreateUserUseCase,
		UpdateUserUseCase,
		DeleteUserUseCase,

		// Repositories
		{
			provide: UserRepositoryImpl,
			useClass: UserRepositoryImpl,
		},
	],
	exports: [
		FindAllUsersUseCase,
		FindUserByIdUseCase,
		CreateUserUseCase,
		UpdateUserUseCase,
		DeleteUserUseCase,
		UserRepositoryImpl,
	],
})
export class UsersModule {}
