# Encryption Package

## Overview

The Encryption package provides standardized encryption and decryption functionality for sensitive data across the application. It is designed to help meet privacy regulations such as LGPD (Brazil), GDPR (Europe), and CCPA (US) by providing secure encryption for sensitive personal data.

## Features

- **Strong Encryption**: Uses AES-256-GCM, an authenticated encryption algorithm that provides both confidentiality and integrity
- **Field-Level Encryption**: Ability to encrypt specific fields in objects
- **Configurable**: Flexible configuration options for encryption parameters
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Error Handling**: Specialized error classes for encryption-related errors

## Components

### EncryptionService

The core service that provides encryption and decryption functionality:

- **encrypt**: Encrypts a string value
- **decrypt**: Decrypts an encrypted value

### FieldEncryptor

A utility for encrypting and decrypting fields in objects:

- **encryptFields**: Encrypts specified fields in an object
- **decryptFields**: Decrypts specified fields in an object

### EncryptionError

A specialized error class for encryption-related errors.

### Encrypt Decorator

A property decorator for marking fields for encryption:

- **Encrypt**: Decorator that marks a property for encryption, specifying which fields to encrypt
- **encryptMarkedFields**: Encrypts all marked fields in an object
- **decryptMarkedFields**: Decrypts all marked fields in an object

## Usage Examples

### Basic Encryption and Decryption

```typescript
import { EncryptionService } from "@enterprise/encryption";

// Create an encryption service with a 32-byte key
const encryptionService = new EncryptionService({
  secretKey: process.env.ENCRYPTION_KEY || "a-very-secret-key-that-is-32-bytes",
});

// Encrypt a value
const encrypted = encryptionService.encrypt("sensitive data");

// Decrypt a value
const decrypted = encryptionService.decrypt(encrypted);
console.log(decrypted); // 'sensitive data'
```

### Field-Level Encryption

```typescript
import { EncryptionService, FieldEncryptor } from "@enterprise/encryption";

// Create an encryption service
const encryptionService = new EncryptionService({
  secretKey: process.env.ENCRYPTION_KEY || "a-very-secret-key-that-is-32-bytes",
});

// Create a field encryptor for specific fields
const fieldEncryptor = new FieldEncryptor(encryptionService, {
  fields: ["email", "phoneNumber", "ssn"],
});

// User object with sensitive data
const user = {
  id: "123",
  name: "John Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1234567890",
  ssn: "123-45-6789",
};

// Encrypt sensitive fields
const encryptedUser = fieldEncryptor.encryptFields(user);
console.log(encryptedUser);
// {
//   id: '123',
//   name: 'John Doe',
//   email: { content: '...', iv: '...', authTag: '...' }, // authTag might be undefined in some environments
//   phoneNumber: { content: '...', iv: '...', authTag: '...' },
//   ssn: { content: '...', iv: '...', authTag: '...' }
// }

// Note: The authTag property might not be present in all environments or Node.js versions.
// The encryption service is designed to work with or without authentication tags.

// Decrypt sensitive fields
const decryptedUser = fieldEncryptor.decryptFields(encryptedUser);
console.log(decryptedUser);
// {
//   id: '123',
//   name: 'John Doe',
//   email: 'john.doe@example.com',
//   phoneNumber: '+1234567890',
//   ssn: '123-45-6789'
// }
```

### Using the Encrypt Decorator

```typescript
import {
  EncryptionService,
  Encrypt,
  encryptMarkedFields,
  decryptMarkedFields,
} from "@enterprise/encryption";

// Create an encryption service
const encryptionService = new EncryptionService({
  secretKey: process.env.ENCRYPTION_KEY || "a-very-secret-key-that-is-32-bytes",
});

// Define a class with encrypted fields
class UserProfile {
  id: string;
  name: string;

  // Mark the contactInfo property for encryption, specifying which fields to encrypt
  @Encrypt(["email", "phoneNumber"])
  contactInfo: {
    email: string;
    phoneNumber: string;
    address: string; // This field won't be encrypted
  };

  // Mark the financialInfo property for encryption, specifying which fields to encrypt
  @Encrypt(["ssn", "accountNumber"])
  financialInfo: {
    ssn: string;
    accountNumber: string;
    income: number; // This field won't be encrypted
  };

  constructor(id: string, name: string, contactInfo: any, financialInfo: any) {
    this.id = id;
    this.name = name;
    this.contactInfo = contactInfo;
    this.financialInfo = financialInfo;
  }
}

// Create a user profile
const userProfile = new UserProfile(
  "123",
  "John Doe",
  {
    email: "john.doe@example.com",
    phoneNumber: "+1234567890",
    address: "123 Main St",
  },
  {
    ssn: "123-45-6789",
    accountNumber: "9876543210",
    income: 75000,
  },
);

// Encrypt all marked fields
const encryptedProfile = encryptMarkedFields(userProfile, encryptionService);
console.log(encryptedProfile);
// {
//   id: '123',
//   name: 'John Doe',
//   contactInfo: {
//     email: { content: '...', iv: '...', authTag: '...' }, // authTag might be undefined in some environments
//     phoneNumber: { content: '...', iv: '...', authTag: '...' },
//     address: '123 Main St' // Not encrypted
//   },
//   financialInfo: {
//     ssn: { content: '...', iv: '...', authTag: '...' },
//     accountNumber: { content: '...', iv: '...', authTag: '...' },
//     income: 75000 // Not encrypted
//   }
// }

// Decrypt all marked fields
const decryptedProfile = decryptMarkedFields(
  encryptedProfile,
  encryptionService,
);
console.log(decryptedProfile);
// Original user profile with decrypted fields
```

### Integration with Domain Entities

```typescript
import {
  EncryptionService,
  Encrypt,
  encryptMarkedFields,
  decryptMarkedFields,
} from "@enterprise/encryption";
import { User } from "@/user/entities/User.entity";

// Create an encryption service
const encryptionService = new EncryptionService({
  secretKey: process.env.ENCRYPTION_KEY || "a-very-secret-key-that-is-32-bytes",
});

// Define a data transfer object with encrypted fields
class UserDTO {
  id: string;
  name: string;

  @Encrypt("email")
  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email.data;
  }
}

// Function to encrypt user data before storing
function prepareUserForStorage(user: User): Record<string, any> {
  const userDTO = new UserDTO(user);
  return encryptMarkedFields(userDTO, encryptionService);
}

// Function to decrypt user data after retrieval
function hydrateUserFromStorage(
  encryptedData: Record<string, any>,
): Record<string, any> {
  return decryptMarkedFields(encryptedData, encryptionService);
}
```

## Security Considerations

1. **Key Management**: Securely store and manage encryption keys. Consider using a key management service (KMS) for production environments.
2. **Environment Variables**: Store encryption keys in environment variables, not in code.
3. **Key Rotation**: Implement a key rotation policy to periodically change encryption keys.
4. **Backup**: Ensure encrypted data and keys are properly backed up.

## Compliance with Privacy Regulations

This package helps meet the technical requirements of privacy regulations by:

- **LGPD (Brazil)**: Providing technical measures to protect personal data (Article 46)
- **GDPR (Europe)**: Implementing appropriate technical measures for data protection (Article 32)
- **CCPA (US)**: Implementing reasonable security procedures and practices (Section 1798.150)

However, compliance with these regulations also requires organizational measures and policies beyond technical implementation.
