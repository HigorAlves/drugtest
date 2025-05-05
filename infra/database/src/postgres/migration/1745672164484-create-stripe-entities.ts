import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateStripeEntities1745672164484 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE stripe_customers (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        stripe_customer_id VARCHAR(255) UNIQUE NOT NULL,
        default_payment_method VARCHAR(255)
      )
    `)

		await queryRunner.query(`
      CREATE TABLE stripe_subscriptions (
        id SERIAL PRIMARY KEY,
        stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        price_id VARCHAR(255),
        status VARCHAR(50),
        current_period_start TIMESTAMP,
        current_period_end TIMESTAMP,
        cancel_at_period_end BOOLEAN DEFAULT FALSE,
        canceled_at TIMESTAMP
      )
    `)

		await queryRunner.query(`
      CREATE TABLE stripe_invoices (
        id SERIAL PRIMARY KEY,
        stripe_invoice_id VARCHAR(255) UNIQUE NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        amount_due INTEGER,
        currency VARCHAR(10),
        status VARCHAR(50),
        hosted_invoice_url TEXT,
        created_at TIMESTAMP
      )
    `)

		await queryRunner.query(`
      CREATE TABLE stripe_payment_intents (
        id SERIAL PRIMARY KEY,
        stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        amount INTEGER,
        currency VARCHAR(10),
        status VARCHAR(50),
        payment_method VARCHAR(255),
        created_at TIMESTAMP
      )
    `)

		await queryRunner.query(`
      CREATE TABLE stripe_webhook_events (
        id SERIAL PRIMARY KEY,
        stripe_event_id VARCHAR(255) UNIQUE NOT NULL,
        event_type VARCHAR(255),
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed BOOLEAN DEFAULT FALSE,
        raw_payload JSONB
      )
    `)

		await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN stripe_customer_id VARCHAR(255) UNIQUE,
      ADD COLUMN default_payment_method VARCHAR(255)
    `)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE IF EXISTS stripe_webhook_events`)
		await queryRunner.query(`DROP TABLE IF EXISTS stripe_payment_intents`)
		await queryRunner.query(`DROP TABLE IF EXISTS stripe_invoices`)
		await queryRunner.query(`DROP TABLE IF EXISTS stripe_subscriptions`)
		await queryRunner.query(`DROP TABLE IF EXISTS stripe_customers`)
		await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN IF EXISTS default_payment_method,
      DROP COLUMN IF EXISTS stripe_customer_id
    `)
	}
}
