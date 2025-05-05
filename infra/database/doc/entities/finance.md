# Finance Entities

This document describes the entities related to financial planning and management in our open finance system.

## Budget

The `Budget` entity represents a financial budget for a specific period, helping users plan and track their spending.

### Fields

| Field        | Type      | Description                                    |
| ------------ | --------- | ---------------------------------------------- |
| id           | uuid      | Unique identifier for the budget               |
| userId       | uuid      | ID of the user who owns the budget             |
| name         | string    | Name of the budget                             |
| description  | string    | Description of the budget                      |
| amount       | decimal   | Total budget amount                            |
| currencyCode | string    | Currency code for the budget                   |
| startDate    | date      | Start date of the budget period                |
| endDate      | date      | End date of the budget period                  |
| type         | string    | Type of budget (monthly, annual, custom, etc.) |
| status       | string    | Status of the budget (active, archived, etc.)  |
| createdAt    | timestamp | When the budget was created                    |
| updatedAt    | timestamp | When the budget was last updated               |

### Relationships

- **User**: Many-to-one relationship with the `User` entity
- **BudgetCategoryLinks**: One-to-many relationship with the `BudgetCategoryLink` entity

## BudgetCategoryLink

The `BudgetCategoryLink` entity represents a link between a budget and a category, specifying how much of the budget is
allocated to each category.

### Fields

| Field      | Type      | Description                                    |
| ---------- | --------- | ---------------------------------------------- |
| id         | uuid      | Unique identifier for the budget category link |
| budgetId   | uuid      | ID of the budget                               |
| categoryId | uuid      | ID of the category                             |
| amount     | decimal   | Amount allocated to this category              |
| createdAt  | timestamp | When the link was created                      |
| updatedAt  | timestamp | When the link was last updated                 |

### Relationships

- **Budget**: Many-to-one relationship with the `Budget` entity
- **Category**: Many-to-one relationship with the `Category` entity

## Report

The `Report` entity represents a financial report generated for a user, providing insights into their financial
situation.

### Fields

| Field     | Type      | Description                                       |
| --------- | --------- | ------------------------------------------------- |
| id        | uuid      | Unique identifier for the report                  |
| userId    | uuid      | ID of the user who owns the report                |
| name      | string    | Name of the report                                |
| type      | string    | Type of report (income, expense, cash flow, etc.) |
| startDate | date      | Start date of the report period                   |
| endDate   | date      | End date of the report period                     |
| data      | json      | Report data in JSON format                        |
| createdAt | timestamp | When the report was created                       |
| updatedAt | timestamp | When the report was last updated                  |

### Relationships

- **User**: Many-to-one relationship with the `User` entity

## Goal

The `Goal` entity represents a financial goal set by a user, such as saving for a vacation or paying off debt.

### Fields

| Field         | Type      | Description                                      |
| ------------- | --------- | ------------------------------------------------ |
| id            | uuid      | Unique identifier for the goal                   |
| userId        | uuid      | ID of the user who owns the goal                 |
| name          | string    | Name of the goal                                 |
| description   | string    | Description of the goal                          |
| targetAmount  | decimal   | Target amount for the goal                       |
| currentAmount | decimal   | Current amount saved towards the goal            |
| currencyCode  | string    | Currency code for the goal                       |
| startDate     | date      | Start date for the goal                          |
| targetDate    | date      | Target date for achieving the goal               |
| type          | string    | Type of goal (savings, debt payoff, etc.)        |
| status        | string    | Status of the goal (in progress, achieved, etc.) |
| priority      | string    | Priority of the goal (high, medium, low)         |
| createdAt     | timestamp | When the goal was created                        |
| updatedAt     | timestamp | When the goal was last updated                   |

### Relationships

- **User**: Many-to-one relationship with the `User` entity

## Open Finance Financial Planning Integration

These entities are designed to support open finance financial planning requirements, allowing users to manage their
finances effectively.

### Key Features

- **Budgeting**: Creation and tracking of budgets across different categories
- **Goal Setting**: Setting and tracking financial goals
- **Financial Reporting**: Generation of financial reports for analysis
- **Category-Based Budgeting**: Allocation of budget amounts to specific categories
- **Progress Tracking**: Tracking of progress towards financial goals
- **Multi-Currency Support**: Support for budgets and goals in different currencies
- **Time-Based Planning**: Planning of finances over different time periods

### Open Finance Compliance

The finance entities are designed to comply with open finance standards for financial planning data, including:

- **Budget Management**: Standardized budget creation and tracking
- **Goal Setting**: Standardized goal creation and tracking
- **Financial Reporting**: Standardized financial report generation
- **Data Portability**: Ability to export financial planning data
- **User Control**: User control over financial planning data
- **Data Security**: Secure storage of financial planning data
