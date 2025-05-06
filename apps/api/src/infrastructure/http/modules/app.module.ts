import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DatabaseModule } from '../../database/database.module'
import { JwtAuthGuard, RolesGuard } from '../../security'
import { AuthModule } from './auth.module'
import { DrugsModule } from './drugs.module'
import { IndicationMappingModule } from './indication-mapping.module'
import { IndicationsModule } from './indications.module'
import { ProgramsModule } from './programs.module'
import { UsersModule } from './users.module'

/**
 * Main application module
 * This module imports all feature modules and configures global providers
 */
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
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.TYPEORM_HOST || 'localhost',
			port: parseInt(process.env.TYPEORM_PORT || '5432', 10),
			username: process.env.TYPEORM_USERNAME || 'dev_local',
			password: process.env.TYPEORM_PASSWORD || 'dev_local',
			database: process.env.TYPEORM_DATABASE || 'dev_local',
			entities: [__dirname + '/../../../**/*.entity{.ts,.js}'],
			synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
		}),
		DatabaseModule,
		AuthModule,
		UsersModule,
		DrugsModule,
		IndicationsModule,
		IndicationMappingModule,
		ProgramsModule,
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
