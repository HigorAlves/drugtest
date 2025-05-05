import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private reflector: Reflector) {
		super()
	}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		// Check if the route is public
		const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [context.getHandler(), context.getClass()])

		// If the route is public, allow access
		if (isPublic) {
			return true
		}

		// Otherwise, use the JWT auth guard
		return super.canActivate(context)
	}
}
