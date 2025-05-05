import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialSetup1741774909654 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		// Create Categories table first, as other tables depend on it.
		await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NULL,
        "name" varchar(255) NOT NULL,
        "type" varchar(10) NOT NULL,
        "icon" varchar(255) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "PK_categories_id" PRIMARY KEY ("id")
      )
    `)

		await queryRunner.query(`
      ALTER TABLE "categories" 
      ADD CONSTRAINT "FK_categories_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL
    `)

		// Add a check constraint for the category type (income or expense)
		await queryRunner.query(`
      ALTER TABLE "categories"
      ADD CONSTRAINT "CHK_categories_type" CHECK ("type" IN ('income', 'expense'))
    `)

		// Create Budgets table
		await queryRunner.query(`
      CREATE TABLE "budgets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "categoryId" uuid NOT NULL,
        "amount" decimal(10,2) NOT NULL,
        "period" varchar(10) NOT NULL,
        "startDate" TIMESTAMP NOT NULL,
        "endDate" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "PK_budgets_id" PRIMARY KEY ("id")
      )
    `)

		await queryRunner.query(`
      ALTER TABLE "budgets" 
      ADD CONSTRAINT "FK_budgets_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
    `)

		await queryRunner.query(`
      ALTER TABLE "budgets" 
      ADD CONSTRAINT "FK_budgets_category" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE
    `)

		// Add a check constraint for the period (monthly, weekly, custom)
		await queryRunner.query(`
      ALTER TABLE "budgets"
      ADD CONSTRAINT "CHK_budgets_period" CHECK ("period" IN ('monthly', 'weekly', 'custom'))
    `)

		// Create Transactions table
		await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "account_id" uuid NOT NULL,
        "category_id" uuid NULL,
        "type" varchar(10) NOT NULL,
        "amount" decimal(10,2) NOT NULL,
        "subcategory" varchar(50) NULL,
        "date" TIMESTAMP NOT NULL,
        "notes" text NULL,
        "recurring" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "PK_transactions_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_transaction_type" CHECK ("type" IN ('income', 'expense'))
      )
    `)

		await queryRunner.query(`
      ALTER TABLE "transactions"
      ADD CONSTRAINT "FK_transactions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `)

		await queryRunner.query(`
      ALTER TABLE "transactions"
      ADD CONSTRAINT "FK_transactions_account" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE
    `)

		await queryRunner.query(`
      ALTER TABLE "transactions"
      ADD CONSTRAINT "FK_transactions_category" FOREIGN KEY 
      ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL
    `)

		// Create Reports table
		await queryRunner.query(`
      CREATE TABLE "reports" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "type" varchar(255) NOT NULL,
        "data" json NOT NULL,
        "generatedAt" TIMESTAMP NOT NULL,
        CONSTRAINT "PK_reports_id" PRIMARY KEY ("id")
      )
    `)

		await queryRunner.query(`
      ALTER TABLE "reports"
      ADD CONSTRAINT "FK_reports_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
    `)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Reverse the changes: drop tables in proper order
		await queryRunner.query(`ALTER TABLE "reports" DROP CONSTRAINT "FK_reports_user"`)
		await queryRunner.query(`DROP TABLE "reports"`)

		await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_transactions_category"`)
		await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_transactions_account"`)
		await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_transactions_user"`)
		await queryRunner.query(`DROP TABLE "transactions"`)

		await queryRunner.query(`ALTER TABLE "budgets" DROP CONSTRAINT "FK_budgets_category"`)
		await queryRunner.query(`ALTER TABLE "budgets" DROP CONSTRAINT "FK_budgets_user"`)
		await queryRunner.query(`DROP TABLE "budgets"`)

		await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "CHK_categories_type"`)
		await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_categories_user"`)
		await queryRunner.query(`DROP TABLE "categories"`)
	}
}
