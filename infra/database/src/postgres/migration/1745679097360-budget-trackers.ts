import { MigrationInterface, QueryRunner } from 'typeorm'

export class BudgetTrackers1745679097360 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE goals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        target_amount DECIMAL(15,2) NOT NULL,
        current_amount DECIMAL(15,2) DEFAULT 0,
        type VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

		// --- Create BudgetCategoryLinks Table ---
		await queryRunner.query(`
      CREATE TABLE budget_category_links (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
        category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE
      );
    `)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// --- Drop BudgetCategoryLinks Table ---
		await queryRunner.query(`DROP TABLE IF EXISTS budget_category_links`)

		// --- Drop Goals Table ---
		await queryRunner.query(`DROP TABLE IF EXISTS goals`)
	}
}
