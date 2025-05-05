# Transaction Entities

This document describes the entities related to financial transactions in our open finance system.

## Transaction

The `Transaction` entity represents a financial transaction in the system, such as a deposit, withdrawal, payment, or
transfer.

### Fields

| Field          | Type      | Description                                        |
| -------------- | --------- | -------------------------------------------------- |
| id             | uuid      | Unique identifier for the transaction              |
| userId         | uuid      | ID of the user who owns the transaction            |
| accountId      | uuid      | ID of the account associated with the transaction  |
| description    | string    | Description of the transaction                     |
| descriptionRaw | string    | Raw description from the financial institution     |
| currencyCode   | string    | Currency code for the transaction                  |
| amount         | decimal   | Amount of the transaction                          |
| date           | timestamp | Date and time of the transaction                   |
| balance        | decimal   | Account balance after the transaction              |
| category       | string    | Category name for the transaction                  |
| categoryId     | uuid      | ID of the category associated with the transaction |
| type           | enum      | Type of transaction flow (CREDIT or DEBIT)         |
| status         | enum      | Status of the transaction (POSTED or PENDING)      |
| providerCode   | string    | Code from the financial data provider              |
| providerId     | string    | ID from the financial data provider                |
| notes          | string    | User notes about the transaction                   |
| recurring      | boolean   | Whether this is a recurring transaction            |
| createdAt      | timestamp | When the transaction was created                   |
| updatedAt      | timestamp | When the transaction was last updated              |

### Relationships

- **User**: Many-to-one relationship with the `User` entity
- **Account**: Many-to-one relationship with the `Account` entity
- **LinkedCategory**: Many-to-one relationship with the `Category` entity
- **CreditCardMetadata**: One-to-one relationship with the `CreditCardTransactionMetadata` entity

## RecurringTransaction

The `RecurringTransaction` entity represents a transaction that occurs on a regular basis, such as a subscription or
bill payment.

### Fields

| Field        | Type      | Description                                                    |
| ------------ | --------- | -------------------------------------------------------------- |
| id           | uuid      | Unique identifier for the recurring transaction                |
| userId       | uuid      | ID of the user who owns the recurring transaction              |
| accountId    | uuid      | ID of the account associated with the recurring transaction    |
| description  | string    | Description of the recurring transaction                       |
| amount       | decimal   | Amount of the recurring transaction                            |
| currencyCode | string    | Currency code for the recurring transaction                    |
| frequency    | string    | Frequency of the recurring transaction (monthly, weekly, etc.) |
| startDate    | date      | Date when the recurring transaction starts                     |
| endDate      | date      | Date when the recurring transaction ends (if applicable)       |
| dayOfMonth   | number    | Day of the month for monthly recurring transactions            |
| dayOfWeek    | number    | Day of the week for weekly recurring transactions              |
| categoryId   | uuid      | ID of the category associated with the recurring transaction   |
| type         | enum      | Type of transaction flow (CREDIT or DEBIT)                     |
| active       | boolean   | Whether the recurring transaction is active                    |
| createdAt    | timestamp | When the recurring transaction was created                     |
| updatedAt    | timestamp | When the recurring transaction was last updated                |

### Relationships

- **User**: Many-to-one relationship with the `User` entity
- **Account**: Many-to-one relationship with the `Account` entity
- **Category**: Many-to-one relationship with the `Category` entity

## TransactionSplit

The `TransactionSplit` entity represents a split of a transaction into multiple categories, allowing for more detailed
financial tracking.

### Fields

| Field         | Type      | Description                                 |
| ------------- | --------- | ------------------------------------------- |
| id            | uuid      | Unique identifier for the transaction split |
| transactionId | uuid      | ID of the transaction being split           |
| categoryId    | uuid      | ID of the category for this split           |
| amount        | decimal   | Amount allocated to this split              |
| description   | string    | Description for this split                  |
| createdAt     | timestamp | When the transaction split was created      |
| updatedAt     | timestamp | When the transaction split was last updated |

### Relationships

- **Transaction**: Many-to-one relationship with the `Transaction` entity
- **Category**: Many-to-one relationship with the `Category` entity

## Open Finance Transaction Integration

These entities are designed to support open finance transaction requirements, allowing for comprehensive tracking and
analysis of financial transactions.

### Key Features

- **Transaction Categorization**: Automatic and manual categorization of transactions
- **Transaction Splitting**: Ability to split transactions across multiple categories
- **Recurring Transaction Tracking**: Identification and management of recurring transactions
- **Transaction Status Tracking**: Tracking of pending and posted transactions
- **Multi-Currency Support**: Support for transactions in different currencies
- **Transaction Metadata**: Storage of additional information about transactions
- **Transaction History**: Comprehensive history of all financial transactions
- **Balance Tracking**: Tracking of account balances over time

### Open Finance Compliance

The transaction entities are designed to comply with open finance standards for transaction data, including:

- **Transaction Identification**: Unique identifiers for all transactions
- **Transaction Categorization**: Standard categories for financial transactions
- **Transaction Status**: Clear indication of transaction status
- **Transaction Metadata**: Additional information about transactions
- **Transaction History**: Comprehensive history of all financial transactions
