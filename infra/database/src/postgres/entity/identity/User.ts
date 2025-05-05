import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import {
	Account,
	StripeCustomer,
	StripeInvoice,
	StripePaymentIntent,
	StripeSubscription,
	UserAddress,
	UserEmail,
	UserPhoneNumber,
} from '@/postgres/entity'

export enum DocumentType {
	CPF = 'CPF',
	CNPJ = 'CNPJ',
}

export enum InvestorProfile {
	CONSERVATIVE = 'Conservative',
	MODERATE = 'Moderate',
	AGGRESSIVE = 'Aggressive',
}

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column({ type: 'varchar', length: 255 })
	fullName!: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	companyName?: string

	@Column({ type: 'varchar', length: 20 })
	document!: string

	@Column({ type: 'varchar', length: 20 })
	taxNumber!: string

	@Column({ type: 'enum', enum: DocumentType })
	documentType!: DocumentType

	@Column({ type: 'varchar', length: 255, nullable: true })
	jobTitle?: string

	@Column({ type: 'date', nullable: true })
	birthDate?: Date

	@Column({ type: 'enum', enum: InvestorProfile, nullable: true })
	investorProfile?: InvestorProfile

	@Column({ type: 'varchar', length: 10 })
	currency!: string

	@Column({ type: 'varchar', length: 10 })
	locale!: string

	@Column({ type: 'varchar', length: 10, nullable: true })
	establishmentCode?: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	establishmentName?: string

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt!: Date

	@UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	updatedAt!: Date

	@OneToMany(() => Account, (account) => account.user)
	accounts: Account[] | null = null

	@OneToOne(() => StripeCustomer, (customer) => customer.user)
	stripeCustomer: StripeCustomer | null = null

	@OneToMany(() => StripeSubscription, (subscription) => subscription.user)
	subscriptions: StripeSubscription[] | null = null

	@OneToMany(() => StripeInvoice, (invoice) => invoice.user)
	invoices: StripeInvoice[] | null = null

	@OneToMany(() => StripePaymentIntent, (paymentIntent) => paymentIntent.user)
	paymentIntents: StripePaymentIntent[] | null = null

	@OneToMany(() => UserAddress, (address) => address.user, { cascade: true })
	addresses?: UserAddress[]

	@OneToMany(() => UserPhoneNumber, (phone) => phone.user, { cascade: true })
	phoneNumbers?: UserPhoneNumber[]

	@OneToMany(() => UserEmail, (email) => email.user, { cascade: true })
	emails?: UserEmail[]
}
