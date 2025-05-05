import { Injectable, UnauthorizedException, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { JwtPayload } from '../../../domain/models/jwt-payload.model'
import { UserRepository } from '../../../domain/repositories/user.repository'

/**
 * JWT strategy for authentication
 * This strategy validates JWT tokens and extracts user information
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		@Inject('UserRepository') private readonly userRepository: UserRepository
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
		})
	}

	/**
	 * Validate JWT payload
	 * @param payload - JWT payload
	 * @returns Promise<{ id: string; username: string; role: UserRole }> - User information
	 * @throws UnauthorizedException - If user is not found
	 */
	async validate(payload: JwtPayload) {
		const user = await this.userRepository.findById(payload.sub)
		if (!user) {
			throw new UnauthorizedException('User not found')
		}

		// Return user information without password hash
		return {
			id: user.id,
			username: user.username,
			role: user.role,
		}
	}
}
