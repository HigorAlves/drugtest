# Investment Entities

This document describes the entities related to investments in our open finance system.

## Investment

The `Investment` entity represents an investment held by a user, such as stocks, bonds, mutual funds, or other financial
instruments.

### Fields

| Field         | Type      | Description                                          |
| ------------- | --------- | ---------------------------------------------------- |
| id            | uuid      | Unique identifier for the investment                 |
| userId        | uuid      | ID of the user who owns the investment               |
| name          | string    | Name of the investment                               |
| type          | string    | Type of investment (stock, bond, mutual fund, etc.)  |
| symbol        | string    | Symbol or ticker for the investment                  |
| provider      | string    | Provider or institution where the investment is held |
| quantity      | decimal   | Quantity of the investment held                      |
| purchasePrice | decimal   | Average purchase price per unit                      |
| currentPrice  | decimal   | Current price per unit                               |
| currencyCode  | string    | Currency code for the investment                     |
| purchaseDate  | date      | Date when the investment was purchased               |
| notes         | string    | User notes about the investment                      |
| createdAt     | timestamp | When the investment record was created               |
| updatedAt     | timestamp | When the investment record was last updated          |

### Relationships

- **User**: Many-to-one relationship with the `User` entity
- **InvestmentTransactions**: One-to-many relationship with the `InvestmentTransaction` entity

## InvestmentTransaction

The `InvestmentTransaction` entity represents a transaction related to an investment, such as buying, selling, or
receiving dividends.

### Fields

| Field        | Type      | Description                                      |
| ------------ | --------- | ------------------------------------------------ |
| id           | uuid      | Unique identifier for the investment transaction |
| investmentId | uuid      | ID of the investment                             |
| type         | string    | Type of transaction (buy, sell, dividend, etc.)  |
| date         | date      | Date of the transaction                          |
| quantity     | decimal   | Quantity involved in the transaction             |
| price        | decimal   | Price per unit for the transaction               |
| amount       | decimal   | Total amount of the transaction                  |
| fees         | decimal   | Fees associated with the transaction             |
| taxes        | decimal   | Taxes associated with the transaction            |
| notes        | string    | User notes about the transaction                 |
| createdAt    | timestamp | When the transaction record was created          |
| updatedAt    | timestamp | When the transaction record was last updated     |

### Relationships

- **Investment**: Many-to-one relationship with the `Investment` entity

## Open Finance Investment Integration

These entities are designed to support open finance investment requirements, allowing users to track and manage their
investments across different providers.

### Key Features

- **Investment Portfolio Tracking**: Tracking of investments across different providers
- **Investment Performance Monitoring**: Monitoring of investment performance over time
- **Transaction History**: Comprehensive history of investment transactions
- **Dividend Tracking**: Tracking of dividends and other investment income
- **Multi-Currency Support**: Support for investments in different currencies
- **Investment Categorization**: Categorization of investments by type
- **Cost Basis Tracking**: Tracking of investment cost basis for tax purposes
- **Realized/Unrealized Gains**: Calculation of realized and unrealized gains

### Open Finance Compliance

The investment entities are designed to comply with open finance standards for investment data, including:

- **Investment Identification**: Unique identifiers for all investments
- **Investment Categorization**: Standard categories for investments
- **Transaction History**: Comprehensive history of all investment transactions
- **Performance Metrics**: Standardized performance metrics
- **Data Portability**: Ability to export investment data
- **User Control**: User control over investment data
- **Data Security**: Secure storage of investment data

### Integration with Financial Planning

The investment entities integrate with the financial planning entities to provide a comprehensive view of a user's
financial situation:

- **Goal Tracking**: Investments can be linked to financial goals
- **Net Worth Calculation**: Investments are included in net worth calculations
- **Financial Reports**: Investment data is included in financial reports
- **Risk Assessment**: Investment data is used for risk assessment
