# Account Entities

This document describes the entities related to financial accounts in our open finance system.

## Account

The `Account` entity represents a financial account in the system. It can be either a bank account or a credit account,
with specific details stored in the related entities.

### Fields

| Field        | Type      | Description                                              |
| ------------ | --------- | -------------------------------------------------------- |
| id           | uuid      | Unique identifier for the account                        |
| userId       | uuid      | ID of the user who owns the account                      |
| name         | string    | Name of the account                                      |
| type         | string    | Type of account (BANK or CREDIT)                         |
| subtype      | string    | Subtype of account (CHECKING_ACCOUNT, CREDIT_CARD, etc.) |
| number       | string    | Account/card number                                      |
| balance      | decimal   | Current balance of the account                           |
| currencyCode | string    | Currency code for the account                            |
| taxNumber    | string    | Tax number associated with the account                   |
| owner        | string    | Name of the account owner                                |
| createdAt    | timestamp | When the account was created                             |
| updatedAt    | timestamp | When the account was last updated                        |

### Relationships

- **User**: Many-to-one relationship with the `User` entity
- **BankAccount**: One-to-one relationship with the `BankAccount` entity (for bank accounts)
- **CreditAccount**: One-to-one relationship with the `CreditAccount` entity (for credit accounts)

## BankAccount

The `BankAccount` entity contains additional details specific to bank accounts.

### Fields

| Field         | Type   | Description                                    |
| ------------- | ------ | ---------------------------------------------- |
| id            | uuid   | Unique identifier for the bank account data    |
| accountId     | uuid   | ID of the associated account                   |
| bankName      | string | Name of the bank                               |
| branchCode    | string | Branch code                                    |
| accountNumber | string | Account number                                 |
| accountType   | string | Type of bank account (checking, savings, etc.) |
| routingNumber | string | Routing number for the bank                    |
| swiftCode     | string | SWIFT code for international transfers         |
| iban          | string | International Bank Account Number              |

### Relationships

- **Account**: One-to-one relationship with the `Account` entity

## CreditAccount

The `CreditAccount` entity contains additional details specific to credit accounts.

### Fields

| Field           | Type    | Description                                   |
| --------------- | ------- | --------------------------------------------- |
| id              | uuid    | Unique identifier for the credit account data |
| accountId       | uuid    | ID of the associated account                  |
| creditLimit     | decimal | Credit limit for the account                  |
| availableCredit | decimal | Available credit                              |
| dueDate         | date    | Due date for payments                         |
| minimumPayment  | decimal | Minimum payment amount                        |
| interestRate    | decimal | Interest rate for the credit account          |
| cardType        | string  | Type of credit card (Visa, Mastercard, etc.)  |
| cardNumber      | string  | Credit card number                            |
| expirationDate  | date    | Expiration date for the credit card           |

### Relationships

- **Account**: One-to-one relationship with the `Account` entity

## Category

The `Category` entity represents a transaction category for financial management.

### Fields

| Field     | Type      | Description                                   |
| --------- | --------- | --------------------------------------------- |
| id        | uuid      | Unique identifier for the category            |
| userId    | uuid      | ID of the user who owns the category          |
| name      | string    | Name of the category                          |
| type      | string    | Type of category (income, expense, etc.)      |
| color     | string    | Color code for visual representation          |
| icon      | string    | Icon name for visual representation           |
| parentId  | uuid      | ID of the parent category (for subcategories) |
| createdAt | timestamp | When the category was created                 |
| updatedAt | timestamp | When the category was last updated            |

### Relationships

- **User**: Many-to-one relationship with the `User` entity
- **Transactions**: One-to-many relationship with the `Transaction` entity

## CreditCardTransactionMetadata

The `CreditCardTransactionMetadata` entity contains additional metadata for credit card transactions.

### Fields

| Field              | Type   | Description                                        |
| ------------------ | ------ | -------------------------------------------------- |
| id                 | uuid   | Unique identifier for the metadata                 |
| transactionId      | uuid   | ID of the associated transaction                   |
| merchantName       | string | Name of the merchant                               |
| merchantCategory   | string | Category of the merchant                           |
| cardLast4          | string | Last 4 digits of the card number                   |
| installments       | number | Number of installments (for installment purchases) |
| currentInstallment | number | Current installment number                         |

### Relationships

- **Transaction**: One-to-one relationship with the `Transaction` entity

## Open Finance Integration

These entities are designed to integrate with open finance APIs, allowing users to connect their financial accounts from
various institutions. The structure follows open finance standards for data representation and exchange.

### Key Features

- **Account Aggregation**: Ability to aggregate accounts from multiple financial institutions
- **Transaction Categorization**: Automatic categorization of transactions
- **Credit Card Management**: Tracking of credit card spending and payments
- **Multi-Currency Support**: Support for accounts in different currencies
