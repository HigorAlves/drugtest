# Exchange Entities

This document describes the entities related to currency exchange in our open finance system.

## ExchangeRate

The `ExchangeRate` entity represents the exchange rate between two currencies at a specific point in time.

### Fields

| Field        | Type      | Description                               |
| ------------ | --------- | ----------------------------------------- |
| id           | uuid      | Unique identifier for the exchange rate   |
| fromCurrency | string    | Source currency code                      |
| toCurrency   | string    | Target currency code                      |
| rate         | decimal   | Exchange rate value                       |
| date         | date      | Date of the exchange rate                 |
| provider     | string    | Provider of the exchange rate data        |
| createdAt    | timestamp | When the exchange rate record was created |

### Usage

Exchange rates are used throughout the system to convert amounts between different currencies. This is particularly
important in an open finance system where users may have accounts, transactions, and investments in multiple currencies.

## Open Finance Currency Exchange Integration

The exchange entities are designed to support open finance requirements for currency exchange, allowing for accurate
conversion between different currencies.

### Key Features

- **Historical Exchange Rates**: Storage of exchange rates over time
- **Multiple Currency Support**: Support for a wide range of currencies
- **Provider Tracking**: Tracking of the source of exchange rate data
- **Real-Time Updates**: Regular updates of exchange rates from providers
- **Conversion Calculations**: Utilities for converting amounts between currencies

### Open Finance Compliance

The exchange entities are designed to comply with open finance standards for currency exchange data, including:

- **Currency Identification**: Standard currency codes (ISO 4217)
- **Exchange Rate Accuracy**: Accurate and up-to-date exchange rates
- **Historical Data**: Storage of historical exchange rates
- **Data Provenance**: Tracking of the source of exchange rate data
- **Data Transparency**: Clear indication of when exchange rates were last updated

### Integration with Other Entities

The exchange entities integrate with other entities in the system to provide currency conversion capabilities:

- **Accounts**: Converting account balances to the user's preferred currency
- **Transactions**: Converting transaction amounts to the user's preferred currency
- **Investments**: Converting investment values to the user's preferred currency
- **Budgets and Goals**: Converting budget and goal amounts to the user's preferred currency
- **Reports**: Generating reports in the user's preferred currency

### Multi-Currency Support

The exchange entities enable the system to support users with financial activities in multiple currencies:

- **Global Users**: Support for users with accounts in different countries
- **International Transfers**: Support for transfers between accounts in different currencies
- **Travel Expenses**: Support for tracking expenses in foreign currencies
- **Investment Diversification**: Support for investments in different currencies
- **Business Operations**: Support for businesses operating in multiple countries
