import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

import { ValidateUserUseCase } from '../../../application/auth/validate-user.use-case'

/**
 * Local strategy for authentication
 * This strategy validates username and password credentials
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly validateUserUseCase: ValidateUserUseCase) {
		super()
	}

	/**
	 * Validate username and password
	 * @param username - Username
	 * @param password - Password
	 * @returns Promise<any> - User information
	 * @throws UnauthorizedException - If credentials are invalid
	 */
	async validate(username: string, password: string): Promise<any> {
		const user = await this.validateUserUseCase.execute(username, password)
		if (!user) {
			throw new UnauthorizedException()
		}
		return user
	}
}
