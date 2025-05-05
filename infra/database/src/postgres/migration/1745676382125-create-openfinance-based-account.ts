import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateOpenfinanceBasedAccount1745676382125 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		// --- Update Accounts Table ---
		await queryRunner.query(`
      ALTER TABLE accounts
      ADD COLUMN subtype VARCHAR(50),
      ADD COLUMN number VARCHAR(50),
      ADD COLUMN tax_number VARCHAR(14),
      ADD COLUMN owner VARCHAR(255),
      ADD COLUMN currency_code VARCHAR(10);
    `)

		// --- Create BankAccountData Table ---
		await queryRunner.query(`
      CREATE TABLE bank_account_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        account_id UUID UNIQUE REFERENCES accounts(id) ON DELETE CASCADE,
        transfer_number VARCHAR(50) NOT NULL,
        closing_balance DECIMAL(15, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

		// --- Create CreditAccountData Table ---
		await queryRunner.query(`
      CREATE TABLE credit_account_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        account_id UUID UNIQUE REFERENCES accounts(id) ON DELETE CASCADE,
        level VARCHAR(50) NOT NULL,
        brand VARCHAR(50) NOT NULL,
        balance_close_date TIMESTAMP NOT NULL,
        balance_due_date TIMESTAMP NOT NULL,
        available_credit_limit DECIMAL(15, 2) NOT NULL,
        credit_limit DECIMAL(15, 2) NOT NULL,
        is_limit_flexible BOOLEAN NOT NULL,
        balance_foreign_currency DECIMAL(15, 2) NOT NULL,
        minimum_payment DECIMAL(15, 2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        holder_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

		// --- Update Categories Table ---
		await queryRunner.query(`
      ALTER TABLE categories
      ADD COLUMN open_finance_id VARCHAR(20) UNIQUE,
      ADD COLUMN description VARCHAR(255) NOT NULL,
      ADD COLUMN description_translated VARCHAR(255) NOT NULL,
      ADD COLUMN level1 VARCHAR(255) NOT NULL,
      ADD COLUMN level2 VARCHAR(255),
      ADD COLUMN level3 VARCHAR(255),
      ALTER COLUMN id SET DEFAULT gen_random_uuid();
    `)

		// --- Update Transactions Table ---
		await queryRunner.query(`
      ALTER TABLE transactions
      DROP COLUMN IF EXISTS subcategory,
      DROP COLUMN IF EXISTS type,
      DROP COLUMN IF EXISTS amount,
      DROP COLUMN IF EXISTS date,
      DROP COLUMN IF EXISTS notes,
      DROP COLUMN IF EXISTS recurring,
      DROP COLUMN IF EXISTS category_id;

      ALTER TABLE transactions
      ADD COLUMN description VARCHAR(255) NOT NULL,
      ADD COLUMN description_raw TEXT,
      ADD COLUMN currency_code VARCHAR(10) NOT NULL,
      ADD COLUMN amount DECIMAL(15, 2) NOT NULL,
      ADD COLUMN date TIMESTAMP NOT NULL,
      ADD COLUMN balance DECIMAL(15,2),
      ADD COLUMN category VARCHAR(255),
      ADD COLUMN category_id VARCHAR(50),
      ADD COLUMN provider_code VARCHAR(100),
      ADD COLUMN provider_id VARCHAR(100),
      ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'POSTED',
      ADD COLUMN flow_type VARCHAR(20) NOT NULL DEFAULT 'DEBIT',
      ADD COLUMN recurring BOOLEAN DEFAULT FALSE,
      ADD COLUMN notes TEXT;
    `)

		// --- Create CreditCardTransactionMetadata Table ---
		await queryRunner.query(`
      CREATE TABLE credit_card_transaction_metadata (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        transaction_id UUID UNIQUE REFERENCES transactions(id) ON DELETE CASCADE,
        installment_number INT NOT NULL,
        total_installments INT NOT NULL,
        total_amount DECIMAL(15,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// --- Rollback CreditCardTransactionMetadata Table ---
		await queryRunner.query(`DROP TABLE IF EXISTS credit_card_transaction_metadata`)

		// --- Rollback Transactions Table ---
		await queryRunner.query(`
      ALTER TABLE transactions
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS description_raw,
      DROP COLUMN IF EXISTS currency_code,
      DROP COLUMN IF EXISTS amount,
      DROP COLUMN IF EXISTS date,
      DROP COLUMN IF EXISTS balance,
      DROP COLUMN IF EXISTS category,
      DROP COLUMN IF EXISTS category_id,
      DROP COLUMN IF EXISTS provider_code,
      DROP COLUMN IF EXISTS provider_id,
      DROP COLUMN IF EXISTS status,
      DROP COLUMN IF EXISTS flow_type,
      DROP COLUMN IF EXISTS recurring,
      DROP COLUMN IF EXISTS notes;
    `)

		await queryRunner.query(`
      ALTER TABLE transactions
      ADD COLUMN subcategory VARCHAR(50),
      ADD COLUMN type VARCHAR(10),
      ADD COLUMN amount DECIMAL(10,2),
      ADD COLUMN date TIMESTAMP,
      ADD COLUMN notes TEXT,
      ADD COLUMN recurring BOOLEAN DEFAULT FALSE,
      ADD COLUMN category_id UUID;
    `)

		// --- Rollback Categories Table ---
		await queryRunner.query(`
      ALTER TABLE categories
      DROP COLUMN IF EXISTS open_finance_id,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS description_translated,
      DROP COLUMN IF EXISTS level1,
      DROP COLUMN IF EXISTS level2,
      DROP COLUMN IF EXISTS level3;
    `)

		// --- Drop CreditAccountData Table ---
		await queryRunner.query(`DROP TABLE IF EXISTS credit_account_data`)

		// --- Drop BankAccountData Table ---
		await queryRunner.query(`DROP TABLE IF EXISTS bank_account_data`)

		// --- Rollback Accounts Table ---
		await queryRunner.query(`
      ALTER TABLE accounts
      DROP COLUMN IF EXISTS subtype,
      DROP COLUMN IF EXISTS number,
      DROP COLUMN IF EXISTS tax_number,
      DROP COLUMN IF EXISTS owner,
      DROP COLUMN IF EXISTS currency_code;
    `)
	}
}
