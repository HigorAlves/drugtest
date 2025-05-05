# System Entities

This document describes the system-level entities in our open finance system, which support operational functions like
auditing, notifications, and system-wide tracking.

## AuditLog

The `AuditLog` entity represents a record of an action taken in the system, providing an audit trail for compliance and
security purposes.

### Fields

| Field      | Type      | Description                                    |
| ---------- | --------- | ---------------------------------------------- |
| id         | uuid      | Unique identifier for the audit log entry      |
| userId     | uuid      | ID of the user who performed the action        |
| action     | string    | Type of action performed                       |
| entityType | string    | Type of entity affected                        |
| entityId   | string    | ID of the entity affected                      |
| oldValues  | json      | Previous values before the change              |
| newValues  | json      | New values after the change                    |
| ipAddress  | string    | IP address from which the action was performed |
| userAgent  | string    | User agent information                         |
| createdAt  | timestamp | When the audit log entry was created           |

### Usage

Audit logs are used to track changes to sensitive data, providing a complete history of who changed what and when. This
is particularly important in an open finance system where data integrity and security are paramount.

## Notification

The `Notification` entity represents a notification sent to a user, such as an alert about account activity or a system
announcement.

### Fields

| Field     | Type      | Description                                      |
| --------- | --------- | ------------------------------------------------ |
| id        | uuid      | Unique identifier for the notification           |
| userId    | uuid      | ID of the user who received the notification     |
| type      | string    | Type of notification                             |
| title     | string    | Title of the notification                        |
| message   | string    | Content of the notification                      |
| read      | boolean   | Whether the notification has been read           |
| readAt    | timestamp | When the notification was read                   |
| data      | json      | Additional data associated with the notification |
| createdAt | timestamp | When the notification was created                |

### Usage

Notifications are used to inform users about important events in the system, such as account activity, security alerts,
or system updates. They help keep users informed and engaged with their financial data.

## Receipt

The `Receipt` entity represents a receipt for a financial transaction, providing proof of payment or other financial
activity.

### Fields

| Field         | Type      | Description                                       |
| ------------- | --------- | ------------------------------------------------- |
| id            | uuid      | Unique identifier for the receipt                 |
| userId        | uuid      | ID of the user who owns the receipt               |
| transactionId | uuid      | ID of the transaction associated with the receipt |
| type          | string    | Type of receipt                                   |
| issuer        | string    | Entity that issued the receipt                    |
| recipient     | string    | Entity that received the payment                  |
| amount        | decimal   | Amount of the transaction                         |
| currency      | string    | Currency of the transaction                       |
| date          | timestamp | Date of the transaction                           |
| description   | string    | Description of the transaction                    |
| fileUrl       | string    | URL to the receipt file                           |
| metadata      | json      | Additional metadata about the receipt             |
| createdAt     | timestamp | When the receipt record was created               |

### Relationships

- **User**: Many-to-one relationship with the `User` entity
- **Transaction**: Many-to-one relationship with the `Transaction` entity

## NetWorthSnapshot

The `NetWorthSnapshot` entity represents a point-in-time snapshot of a user's net worth, including assets and
liabilities.

### Fields

| Field              | Type      | Description                                     |
| ------------------ | --------- | ----------------------------------------------- |
| id                 | uuid      | Unique identifier for the net worth snapshot    |
| userId             | uuid      | ID of the user whose net worth is being tracked |
| date               | date      | Date of the snapshot                            |
| totalAssets        | decimal   | Total value of all assets                       |
| totalLiabilities   | decimal   | Total value of all liabilities                  |
| netWorth           | decimal   | Net worth (totalAssets - totalLiabilities)      |
| currencyCode       | string    | Currency code for the values                    |
| assetBreakdown     | json      | Breakdown of assets by category                 |
| liabilityBreakdown | json      | Breakdown of liabilities by category            |
| createdAt          | timestamp | When the snapshot was created                   |

### Usage

Net worth snapshots are used to track a user's financial health over time, providing insights into how their financial
situation is changing. This is a key feature of an open finance system focused on helping users improve their financial
well-being.

## Open Finance System Integration

These system entities are designed to support the operational requirements of an open finance system, ensuring data
integrity, user communication, and financial tracking.

### Key Features

- **Audit Trail**: Comprehensive tracking of all changes to sensitive data
- **User Notifications**: Timely communication with users about important events
- **Receipt Management**: Storage and retrieval of transaction receipts
- **Net Worth Tracking**: Monitoring of users' financial health over time
- **Data Integrity**: Ensuring the accuracy and consistency of financial data
- **Compliance Support**: Providing the necessary data for regulatory compliance

### Open Finance Compliance

The system entities are designed to comply with open finance standards for system operations, including:

- **Data Auditing**: Comprehensive auditing of all data changes
- **User Communication**: Clear and timely communication with users
- **Transaction Documentation**: Proper documentation of all financial transactions
- **Financial Tracking**: Accurate tracking of financial metrics
- **Data Security**: Secure storage of system operational data
- **Regulatory Compliance**: Support for regulatory reporting requirements

### Integration with Other Entities

The system entities integrate with other entities in the open finance system to provide operational support:

- **User**: Association of system operations with users
- **Transactions**: Documentation and auditing of financial transactions
- **Accounts**: Tracking of account-related activities
- **Financial Planning**: Support for financial planning and analysis
