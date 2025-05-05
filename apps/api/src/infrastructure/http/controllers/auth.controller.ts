import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { LoginUseCase, RegisterUserUseCase } from '../../../application/auth'
import { Public } from '../../security'
import { LoginDto, RegisterDto } from '../dtos/auth.dto'

/**
 * Controller for authentication-related endpoints
 * This class adapts HTTP requests to application use cases
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly loginUseCase: LoginUseCase,
		private readonly registerUserUseCase: RegisterUserUseCase
	) {}

	/**
	 * Login with username and password
	 * @param req - Request object with authenticated user
	 * @param loginDto - Login credentials
	 * @returns Promise<{ access_token: string; user: any }> - JWT token and user info
	 */
	@ApiOperation({ summary: 'Login with username and password' })
	@ApiResponse({
		status: 200,
		description: 'Return JWT token and user info',
		schema: {
			type: 'object',
			properties: {
				access_token: { type: 'string' },
				user: {
					type: 'object',
					properties: {
						id: { type: 'string' },
						username: { type: 'string' },
						role: { type: 'string', enum: ['ADMIN', 'USER'] },
					},
				},
			},
		},
	})
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@Public()
	@UseGuards(AuthGuard('local'))
	@HttpCode(HttpStatus.OK)
	@Post('login')
	async login(@Request() req, @Body() loginDto: LoginDto) {
		return this.loginUseCase.execute(req.user)
	}

	/**
	 * Register a new user
	 * @param registerDto - Registration data
	 * @returns Promise<any> - Created user
	 */
	@ApiOperation({ summary: 'Register a new user' })
	@ApiResponse({
		status: 201,
		description: 'The user has been created',
		schema: {
			type: 'object',
			properties: {
				id: { type: 'string' },
				username: { type: 'string' },
				role: { type: 'string', enum: ['USER'] },
			},
		},
	})
	@ApiResponse({ status: 409, description: 'Username already exists' })
	@Public()
	@Post('register')
	async register(@Body() registerDto: RegisterDto) {
		return this.registerUserUseCase.execute(registerDto.username, registerDto.password)
	}
}
