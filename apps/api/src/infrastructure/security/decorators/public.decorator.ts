import { SetMetadata } from '@nestjs/common';

/**
 * Key for public route metadata
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator for marking routes as public
 * This decorator sets metadata to bypass authentication for public routes
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);