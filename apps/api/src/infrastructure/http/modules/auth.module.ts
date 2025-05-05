import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { LoginUseCase, RegisterUserUseCase, ValidateUserUseCase } from '../../../application/auth'
import { JwtStrategy, LocalStrategy } from '../../security'
import { AuthController } from '../controllers/auth.controller'
import { UsersModule } from './users.module'

/**
 * Module for authentication-related components
 * This module ties together controllers, use cases, and strategies
 */
@Module({
	imports: [
		PassportModule,
		UsersModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
				signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') || '1h' },
			}),
		}),
	],
	controllers: [AuthController],
	providers: [
		// Use cases
		ValidateUserUseCase,
		LoginUseCase,
		RegisterUserUseCase,

		// Strategies
		LocalStrategy,
		JwtStrategy,
	],
	exports: [ValidateUserUseCase, LoginUseCase, RegisterUserUseCase],
})
export class AuthModule {}
