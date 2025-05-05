import { MigrationInterface, QueryRunner } from 'typeorm'

export class CompleteInvestiment1745680019715 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		// --- Recurring Transactions ---
		await queryRunner.query(`
      CREATE TABLE recurring_transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        currency_code VARCHAR(10) NOT NULL,
        recurrence VARCHAR(20) NOT NULL,
        next_due_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

		// --- Tags and TransactionTags ---
		await queryRunner.query(`
      CREATE TABLE tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(50) NOT NULL
      );
    `)

		await queryRunner.query(`
      CREATE TABLE transaction_tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
        tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE
      );
    `)

		// --- Transaction Splits ---
		await queryRunner.query(`
      CREATE TABLE transaction_splits (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
        category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        amount DECIMAL(15,2) NOT NULL
      );
    `)

		// --- Investments and Investment Transactions ---
		await queryRunner.query(`
      CREATE TABLE investments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

		await queryRunner.query(`
      CREATE TABLE investment_transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        investment_id UUID NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
        amount DECIMAL(15,2) NOT NULL,
        currency_code VARCHAR(10) NOT NULL,
        date TIMESTAMP NOT NULL,
        transaction_type VARCHAR(10) NOT NULL
      );
    `)

		// --- Net Worth Snapshots ---
		await queryRunner.query(`
      CREATE TABLE net_worth_snapshots (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        total_assets DECIMAL(20,2) NOT NULL,
        total_liabilities DECIMAL(20,2) NOT NULL,
        net_worth DECIMAL(20,2) NOT NULL,
        snapshot_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

		// --- Notifications ---
		await queryRunner.query(`
      CREATE TABLE notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

		// --- Exchange Rates ---
		await queryRunner.query(`
      CREATE TABLE exchange_rates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        from_currency VARCHAR(10) NOT NULL,
        to_currency VARCHAR(10) NOT NULL,
        rate DECIMAL(15,6) NOT NULL,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

		// --- Audit Logs ---
		await queryRunner.query(`
      CREATE TABLE audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(100) NOT NULL,
        details JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Drop tables in reverse order to respect FK dependencies
		await queryRunner.query(`DROP TABLE IF EXISTS audit_logs`)
		await queryRunner.query(`DROP TABLE IF EXISTS exchange_rates`)
		await queryRunner.query(`DROP TABLE IF EXISTS notifications`)
		await queryRunner.query(`DROP TABLE IF EXISTS net_worth_snapshots`)
		await queryRunner.query(`DROP TABLE IF EXISTS investment_transactions`)
		await queryRunner.query(`DROP TABLE IF EXISTS investments`)
		await queryRunner.query(`DROP TABLE IF EXISTS transaction_splits`)
		await queryRunner.query(`DROP TABLE IF EXISTS transaction_tags`)
		await queryRunner.query(`DROP TABLE IF EXISTS tags`)
		await queryRunner.query(`DROP TABLE IF EXISTS recurring_transactions`)
	}
}
