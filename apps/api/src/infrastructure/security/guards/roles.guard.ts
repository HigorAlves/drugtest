import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { UserRole } from '../../../domain/models/user.model'
import { ROLES_KEY } from '../decorators/roles.decorator'

/**
 * Guard for role-based access control
 * This guard checks if the user has the required roles to access a route
 */
@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	/**
	 * Check if the request can activate the route
	 * @param context - Execution context
	 * @returns boolean - Whether the request can activate the route
	 */
	canActivate(context: ExecutionContext): boolean {
		// Get the required roles from the route handler
		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		])

		// If no roles are required, allow access
		if (!requiredRoles) {
			return true
		}

		// Get the user from the request
		const { user } = context.switchToHttp().getRequest()

		// If no user is present, deny access
		if (!user) {
			return false
		}

		// Check if the user has one of the required roles
		return requiredRoles.some((role) => user.role === role)
	}
}
