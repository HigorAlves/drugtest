# External Service Entities

This document describes the entities related to external services in our open finance system, particularly the
integration with Stripe for payment processing.

## StripeCustomer

The `StripeCustomer` entity represents a customer in the Stripe payment processing system.

### Fields

| Field            | Type      | Description                                         |
| ---------------- | --------- | --------------------------------------------------- |
| id               | uuid      | Unique identifier for the Stripe customer record    |
| userId           | uuid      | ID of the user associated with this Stripe customer |
| stripeCustomerId | string    | Customer ID in the Stripe system                    |
| email            | string    | Email address of the customer                       |
| name             | string    | Name of the customer                                |
| phone            | string    | Phone number of the customer                        |
| metadata         | json      | Additional metadata about the customer              |
| createdAt        | timestamp | When the customer record was created                |
| updatedAt        | timestamp | When the customer record was last updated           |

### Relationships

- **User**: Many-to-one relationship with the `User` entity

## StripeSubscription

The `StripeSubscription` entity represents a subscription in the Stripe payment processing system.

### Fields

| Field                | Type      | Description                                                        |
| -------------------- | --------- | ------------------------------------------------------------------ |
| id                   | uuid      | Unique identifier for the Stripe subscription record               |
| userId               | uuid      | ID of the user who owns the subscription                           |
| stripeSubscriptionId | string    | Subscription ID in the Stripe system                               |
| stripeCustomerId     | string    | Customer ID in the Stripe system                                   |
| status               | string    | Status of the subscription (active, canceled, etc.)                |
| planId               | string    | ID of the plan in the Stripe system                                |
| planName             | string    | Name of the plan                                                   |
| amount               | decimal   | Amount charged for the subscription                                |
| currency             | string    | Currency of the subscription                                       |
| interval             | string    | Billing interval (month, year, etc.)                               |
| currentPeriodStart   | timestamp | Start of the current billing period                                |
| currentPeriodEnd     | timestamp | End of the current billing period                                  |
| cancelAtPeriodEnd    | boolean   | Whether the subscription will be canceled at the end of the period |
| canceledAt           | timestamp | When the subscription was canceled                                 |
| metadata             | json      | Additional metadata about the subscription                         |
| createdAt            | timestamp | When the subscription record was created                           |
| updatedAt            | timestamp | When the subscription record was last updated                      |

### Relationships

- **User**: Many-to-one relationship with the `User` entity

## StripeInvoice

The `StripeInvoice` entity represents an invoice in the Stripe payment processing system.

### Fields

| Field                | Type      | Description                                     |
| -------------------- | --------- | ----------------------------------------------- |
| id                   | uuid      | Unique identifier for the Stripe invoice record |
| userId               | uuid      | ID of the user who owns the invoice             |
| stripeInvoiceId      | string    | Invoice ID in the Stripe system                 |
| stripeCustomerId     | string    | Customer ID in the Stripe system                |
| stripeSubscriptionId | string    | Subscription ID in the Stripe system            |
| status               | string    | Status of the invoice (paid, open, etc.)        |
| amount               | decimal   | Total amount of the invoice                     |
| amountPaid           | decimal   | Amount paid on the invoice                      |
| amountRemaining      | decimal   | Amount remaining to be paid                     |
| currency             | string    | Currency of the invoice                         |
| invoiceDate          | timestamp | Date of the invoice                             |
| dueDate              | timestamp | Due date for payment                            |
| paidAt               | timestamp | When the invoice was paid                       |
| metadata             | json      | Additional metadata about the invoice           |
| createdAt            | timestamp | When the invoice record was created             |
| updatedAt            | timestamp | When the invoice record was last updated        |

### Relationships

- **User**: Many-to-one relationship with the `User` entity

## StripePaymentIntent

The `StripePaymentIntent` entity represents a payment intent in the Stripe payment processing system.

### Fields

| Field                 | Type      | Description                                                |
| --------------------- | --------- | ---------------------------------------------------------- |
| id                    | uuid      | Unique identifier for the Stripe payment intent record     |
| userId                | uuid      | ID of the user who initiated the payment                   |
| stripePaymentIntentId | string    | Payment intent ID in the Stripe system                     |
| stripeCustomerId      | string    | Customer ID in the Stripe system                           |
| status                | string    | Status of the payment intent (succeeded, processing, etc.) |
| amount                | decimal   | Amount of the payment                                      |
| currency              | string    | Currency of the payment                                    |
| paymentMethod         | string    | Payment method used                                        |
| description           | string    | Description of the payment                                 |
| metadata              | json      | Additional metadata about the payment intent               |
| createdAt             | timestamp | When the payment intent record was created                 |
| updatedAt             | timestamp | When the payment intent record was last updated            |

### Relationships

- **User**: Many-to-one relationship with the `User` entity

## StripeWebhookEvent

The `StripeWebhookEvent` entity represents a webhook event received from the Stripe payment processing system.

### Fields

| Field         | Type      | Description                                    |
| ------------- | --------- | ---------------------------------------------- |
| id            | uuid      | Unique identifier for the webhook event record |
| stripeEventId | string    | Event ID in the Stripe system                  |
| type          | string    | Type of the event                              |
| object        | string    | Object type that the event applies to          |
| data          | json      | Data associated with the event                 |
| processed     | boolean   | Whether the event has been processed           |
| processedAt   | timestamp | When the event was processed                   |
| error         | string    | Error message if processing failed             |
| createdAt     | timestamp | When the webhook event record was created      |

## Open Finance External Service Integration

These entities are designed to support open finance requirements for integration with external payment processing
services, particularly Stripe.

### Key Features

- **Customer Management**: Tracking of customer information in Stripe
- **Subscription Management**: Tracking of subscription information
- **Invoice Tracking**: Tracking of invoices and payments
- **Payment Processing**: Processing of payments through Stripe
- **Webhook Event Handling**: Processing of webhook events from Stripe
- **Metadata Storage**: Storage of additional metadata about Stripe objects

### Open Finance Compliance

The external service entities are designed to comply with open finance standards for payment processing, including:

- **Payment Transparency**: Clear tracking of payment information
- **Subscription Management**: Transparent subscription information
- **Invoice Tracking**: Comprehensive tracking of invoices
- **Data Security**: Secure storage of payment information
- **Audit Trail**: Tracking of all payment-related events

### Integration with Other Entities

The external service entities integrate with other entities in the system to provide payment processing capabilities:

- **User**: Association of payment information with users
- **Accounts**: Processing of payments from user accounts
- **Transactions**: Recording of payment transactions
