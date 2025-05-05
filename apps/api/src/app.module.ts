import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'

import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { RolesGuard } from './auth/guards/roles.guard'
import { DatabaseModule } from './database/database.module'
import { DrugsModule } from './drugs/drugs.module'
import { IndicationsModule } from './indications/indications.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ThrottlerModule.forRoot([
			{
				name: 'short',
				ttl: 1000,
				limit: 3,
			},
			{
				name: 'medium',
				ttl: 10000,
				limit: 20,
			},
			{
				name: 'long',
				ttl: 60000,
				limit: 100,
			},
		]),
		DatabaseModule,
		AuthModule,
		UsersModule,
		DrugsModule,
		IndicationsModule,
	],
	providers: [
		// Apply JWT authentication globally
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		// Apply role-based access control globally
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
})
export class AppModule {}
