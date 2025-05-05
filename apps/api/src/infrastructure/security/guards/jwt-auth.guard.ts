import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

/**
 * Guard for JWT authentication
 * This guard checks if the request has a valid JWT token
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private reflector: Reflector) {
		super()
	}

	/**
	 * Check if the request can activate the route
	 * @param context - Execution context
	 * @returns boolean | Promise<boolean> | Observable<boolean> - Whether the request can activate the route
	 */
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		// Check if the route is public
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		])

		// If the route is public, allow access
		if (isPublic) {
			return true
		}

		// Otherwise, check if the request has a valid JWT token
		return super.canActivate(context)
	}
}
