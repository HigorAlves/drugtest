import { Module } from '@nestjs/common'

import { databaseProviders } from './database.providers'
import { repositoriesProviders } from './repositories.providers'

@Module({
	providers: [...databaseProviders, ...repositoriesProviders],
	exports: [...databaseProviders, ...repositoriesProviders],
})
export class DatabaseModule {}
