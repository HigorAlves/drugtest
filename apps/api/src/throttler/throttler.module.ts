import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerModule as NestThrottlerModule } from '@nestjs/throttler'

import { ThrottlerGuard } from './guards/throttler.guard'

@Module({
	imports: [
		NestThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				ttl: config.get('THROTTLE_TTL', 60),
				limit: config.get('THROTTLE_LIMIT', 10),
			}),
		}),
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class ThrottlerModule {}
