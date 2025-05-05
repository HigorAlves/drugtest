import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ThrottlerGuard as NestThrottlerGuard } from '@nestjs/throttler'

import { THROTTLER_SKIP } from '../decorators/skip-throttle.decorator'

@Injectable()
export class ThrottlerGuard extends NestThrottlerGuard {
	constructor(reflector: Reflector) {
		super(reflector)
	}

	getTracker(req: Record<string, any>): string {
		return req.ip
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const skipThrottle = this.reflector.getAllAndOverride<boolean>(THROTTLER_SKIP, [
			context.getHandler(),
			context.getClass(),
		])

		if (skipThrottle) {
			return true
		}

		// Skip throttling for Swagger UI routes
		const request = context.switchToHttp().getRequest()
		const path = request.path
		if (path.startsWith('/api/docs') || path.includes('swagger')) {
			return true
		}

		return super.canActivate(context)
	}
}
