# Identity Entities

This document describes the entities related to user identity and personal information in our open finance system.

## User

The `User` entity is the central entity for user identity in the system. It contains personal information, preferences,
and relationships to other entities.

### Fields

| Field             | Type      | Description                                                  |
| ----------------- | --------- | ------------------------------------------------------------ |
| id                | uuid      | Unique identifier for the user                               |
| fullName          | string    | Full name of the user                                        |
| companyName       | string    | Company name (for business users)                            |
| document          | string    | Document number (e.g., ID card number)                       |
| taxNumber         | string    | Tax identification number                                    |
| documentType      | enum      | Type of document (CPF, CNPJ)                                 |
| jobTitle          | string    | User's job title                                             |
| birthDate         | date      | User's date of birth                                         |
| investorProfile   | enum      | User's investor profile (Conservative, Moderate, Aggressive) |
| currency          | string    | User's preferred currency                                    |
| locale            | string    | User's preferred locale                                      |
| establishmentCode | string    | Code for the user's establishment (for business users)       |
| establishmentName | string    | Name of the user's establishment (for business users)        |
| createdAt         | timestamp | When the user was created                                    |
| updatedAt         | timestamp | When the user was last updated                               |

### Relationships

- **Accounts**: One-to-many relationship with the `Account` entity
- **StripeCustomer**: One-to-one relationship with the `StripeCustomer` entity
- **Subscriptions**: One-to-many relationship with the `StripeSubscription` entity
- **Invoices**: One-to-many relationship with the `StripeInvoice` entity
- **PaymentIntents**: One-to-many relationship with the `StripePaymentIntent` entity
- **Addresses**: One-to-many relationship with the `UserAddress` entity
- **PhoneNumbers**: One-to-many relationship with the `UserPhoneNumber` entity
- **Emails**: One-to-many relationship with the `UserEmail` entity

## UserAddress

The `UserAddress` entity represents a physical address associated with a user.

### Fields

| Field        | Type      | Description                                |
| ------------ | --------- | ------------------------------------------ |
| id           | uuid      | Unique identifier for the address          |
| userId       | uuid      | ID of the user who owns the address        |
| type         | string    | Type of address (home, work, etc.)         |
| street       | string    | Street name                                |
| number       | string    | Street number                              |
| complement   | string    | Additional address information             |
| neighborhood | string    | Neighborhood                               |
| city         | string    | City                                       |
| state        | string    | State or province                          |
| country      | string    | Country                                    |
| postalCode   | string    | Postal or ZIP code                         |
| isPrimary    | boolean   | Whether this is the user's primary address |
| createdAt    | timestamp | When the address was created               |
| updatedAt    | timestamp | When the address was last updated          |

### Relationships

- **User**: Many-to-one relationship with the `User` entity

## UserEmail

The `UserEmail` entity represents an email address associated with a user.

### Fields

| Field     | Type      | Description                              |
| --------- | --------- | ---------------------------------------- |
| id        | uuid      | Unique identifier for the email          |
| userId    | uuid      | ID of the user who owns the email        |
| email     | string    | Email address                            |
| type      | string    | Type of email (personal, work, etc.)     |
| verified  | boolean   | Whether the email has been verified      |
| isPrimary | boolean   | Whether this is the user's primary email |
| createdAt | timestamp | When the email was created               |
| updatedAt | timestamp | When the email was last updated          |

### Relationships

- **User**: Many-to-one relationship with the `User` entity

## UserPhoneNumber

The `UserPhoneNumber` entity represents a phone number associated with a user.

### Fields

| Field       | Type      | Description                                     |
| ----------- | --------- | ----------------------------------------------- |
| id          | uuid      | Unique identifier for the phone number          |
| userId      | uuid      | ID of the user who owns the phone number        |
| number      | string    | Phone number                                    |
| countryCode | string    | Country code for the phone number               |
| type        | string    | Type of phone number (mobile, home, work, etc.) |
| verified    | boolean   | Whether the phone number has been verified      |
| isPrimary   | boolean   | Whether this is the user's primary phone number |
| createdAt   | timestamp | When the phone number was created               |
| updatedAt   | timestamp | When the phone number was last updated          |

### Relationships

- **User**: Many-to-one relationship with the `User` entity

## Open Finance Identity Integration

These entities are designed to support open finance identity requirements, allowing for secure and compliant handling of
user information.

### Key Features

- **Comprehensive User Profiles**: Storage of all necessary user information for open finance operations
- **Multiple Contact Methods**: Support for multiple addresses, emails, and phone numbers
- **Identity Verification**: Tracking of verification status for contact information
- **Business User Support**: Fields for business-specific information
- **Investor Profiling**: Classification of users by investment risk profile
- **Internationalization**: Support for different locales and currencies
