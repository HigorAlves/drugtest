import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserEntityOpenfinanceBased1745678537657 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		// --- Update users table ---
		await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN full_name VARCHAR(255) NOT NULL,
      ADD COLUMN company_name VARCHAR(255),
      ADD COLUMN document VARCHAR(20) NOT NULL,
      ADD COLUMN tax_number VARCHAR(20) NOT NULL,
      ADD COLUMN document_type VARCHAR(10) NOT NULL,
      ADD COLUMN job_title VARCHAR(255),
      ADD COLUMN birth_date DATE,
      ADD COLUMN investor_profile VARCHAR(20),
      ADD COLUMN establishment_code VARCHAR(10),
      ADD COLUMN establishment_name VARCHAR(255);
    `)

		// --- Create user_addresses table ---
		await queryRunner.query(`
      CREATE TABLE user_addresses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        full_address VARCHAR(255) NOT NULL,
        country VARCHAR(50) NOT NULL,
        state VARCHAR(50) NOT NULL,
        city VARCHAR(50) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        primary_address VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

		// --- Create user_phone_numbers table ---
		await queryRunner.query(`
      CREATE TABLE user_phone_numbers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        value VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

		// --- Create user_emails table ---
		await queryRunner.query(`
      CREATE TABLE user_emails (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        value VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

		// --- Create user_relations table ---
		await queryRunner.query(`
      CREATE TABLE user_relations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// --- Drop user_relations table ---
		await queryRunner.query(`DROP TABLE IF EXISTS user_relations`)

		// --- Drop user_emails table ---
		await queryRunner.query(`DROP TABLE IF EXISTS user_emails`)

		// --- Drop user_phone_numbers table ---
		await queryRunner.query(`DROP TABLE IF EXISTS user_phone_numbers`)

		// --- Drop user_addresses table ---
		await queryRunner.query(`DROP TABLE IF EXISTS user_addresses`)

		// --- Rollback users table ---
		await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN IF EXISTS full_name,
      DROP COLUMN IF EXISTS company_name,
      DROP COLUMN IF EXISTS document,
      DROP COLUMN IF EXISTS tax_number,
      DROP COLUMN IF EXISTS document_type,
      DROP COLUMN IF EXISTS job_title,
      DROP COLUMN IF EXISTS birth_date,
      DROP COLUMN IF EXISTS investor_profile,
      DROP COLUMN IF EXISTS establishment_code,
      DROP COLUMN IF EXISTS establishment_name;
    `)
	}
}
