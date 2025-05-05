# Open Finance Database Documentation

This documentation provides an overview of the database entities used in our open finance system. The entities are
organized into categories based on their domain.

## Entity Categories

- [Account Entities](./entities/account.md): Entities related to financial accounts (bank accounts, credit accounts,
  etc.)
- [Identity Entities](./entities/identity.md): Entities related to user identity and personal information
- [Transaction Entities](./entities/transaction.md): Entities related to financial transactions
- [Finance Entities](./entities/finance.md): Entities related to financial planning and management
- [Investment Entities](./entities/investment.md): Entities related to investments
- [Exchange Entities](./entities/exchange.md): Entities related to currency exchange
- [External Service Entities](./entities/external.md): Entities related to external services (Stripe, etc.)
- [System Entities](./entities/system.md): Entities related to system operations

## Entity Relationships

The entities in our open finance system are interconnected to provide a comprehensive view of a user's financial data.
The main relationships are:

1. **User to Accounts**: A user can have multiple financial accounts (bank accounts, credit accounts, etc.)
2. **Account to Transactions**: Each account can have multiple transactions
3. **User to Financial Planning**: A user can have budgets, goals, and reports
4. **User to Investments**: A user can have multiple investments
5. **User to External Services**: A user can be linked to external services like Stripe

## Database Diagram

A visual representation of the database schema can be found in the `src/diagrams` directory. You can generate an updated
diagram using the command:

```bash
yarn generate:uml
```

## Best Practices for Entity Design

When designing new entities or modifying existing ones, follow these best practices:

1. **Follow the Open Finance Standards**: Ensure that entities comply with open finance standards and regulations
2. **Use Appropriate Data Types**: Choose the appropriate data types for each field
3. **Define Relationships Clearly**: Use TypeORM decorators to define relationships between entities
4. **Include Audit Fields**: Include fields for tracking creation and update timestamps
5. **Document Entity Purpose**: Include comments explaining the purpose of each entity and its fields
6. **Validate Data**: Use validation decorators to ensure data integrity
7. **Consider Performance**: Design entities with performance in mind, especially for frequently accessed data
