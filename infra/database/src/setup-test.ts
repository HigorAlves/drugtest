import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'

import { ENV } from '@/env'

let teardownHappened = false
let container: StartedPostgreSqlContainer

export async function setup() {
	container = await new PostgreSqlContainer()
		.withHostname(ENV.TYPEORM_HOST)
		.withExposedPorts({
			host: ENV.TYPEORM_PORT,
			container: ENV.TYPEORM_PORT,
		})
		.withUsername(ENV.TYPEORM_USERNAME)
		.withPassword(ENV.TYPEORM_PASSWORD)
		.withDatabase(ENV.TYPEORM_DATABASE)
		.start()
}

export async function teardown() {
	if (teardownHappened) {
		throw new Error('teardown called twice')
	}
	teardownHappened = true
	await container.stop()
}
