import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../domain/models/user.model';

/**
 * Key for roles metadata
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator for role-based access control
 * This decorator sets metadata to check if the user has the required roles
 * @param roles - Roles required to access the route
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);