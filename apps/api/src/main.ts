import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './infrastructure/http/modules/app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	// Enable validation pipe globally
	app.useGlobalPipes(new ValidationPipe({ transform: true }))

	// Enable CORS with specific configuration
	app.enableCors({
		origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		credentials: true,
	})

	// Setup Swagger documentation
	const config = new DocumentBuilder()
		.setTitle('Drug Indication Mapping API')
		.setDescription('API for drug indication mapping service')
		.setVersion('1.0')
		.addTag('auth', 'Authentication endpoints')
		.addTag('users', 'User management endpoints')
		.addTag('drugs', 'Drug management endpoints')
		.addTag('indications', 'Indication management endpoints')
		.addBearerAuth()
		.build()
	const documentFactory = () => SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api/docs', app, documentFactory)

	await app.listen(process.env.PORT ?? 3001)
}
bootstrap()
