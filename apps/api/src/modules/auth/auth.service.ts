import { User, UserRole } from '@enterprise/domain'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { UsersService } from '../users/users.service'

export interface JwtPayload {
	sub: string
	username: string
	role: UserRole
}

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService
	) {}

	async validateUser(username: string, password: string): Promise<any> {
		const user = await this.usersService.findOne(username)
		if (!user) {
			return null
		}

		const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
		if (!isPasswordValid) {
			return null
		}

		// Don't return the password hash
		const { passwordHash, ...result } = user
		return result
	}

	async login(user: any) {
		const payload: JwtPayload = {
			sub: user.id,
			username: user.username,
			role: user.role,
		}

		return {
			access_token: this.jwtService.sign(payload),
			user: {
				id: user.id,
				username: user.username,
				role: user.role,
			},
		}
	}

	async register(username: string, password: string): Promise<any> {
		// Create a new user with USER role by default
		const user = await this.usersService.create(username, password, UserRole.USER)

		// Don't return the password hash
		const { passwordHash, ...result } = user

		return result
	}
}
