# Translations Package

## Overview

The Translations package provides a simple and flexible way to handle translations in both backend and frontend
applications. It supports multiple languages, interpolation of variables, and fallback to default language when a
translation is not found.

## Features

- Multiple language support
- Variable interpolation
- Fallback to default language
- Simple API with TypeScript support

## Installation

The translations package is part of the `@enterprise/shared` package, so you can use it by importing from there:

```typescript
import { createTranslator } from '@enterprise/shared'
```

## Usage

### Basic Usage

```typescript
import { createTranslator } from '@enterprise/shared'

// Define your translation resources
const resources = {
	en: {
		greeting: 'Hello, {{name}}!',
		farewell: 'Goodbye, {{name}}!',
	},
	es: {
		greeting: '¡Hola, {{name}}!',
		farewell: '¡Adiós, {{name}}!',
	},
}

// Create a translator instance
const translator = createTranslator(resources)

// Translate a key
console.log(translator.translate('greeting', { name: 'John' })) // Output: Hello, John!

// Change the language
translator.setLanguage('es')
console.log(translator.translate('greeting', { name: 'John' })) // Output: ¡Hola, John!

// Short alias for translate
console.log(translator.t('farewell', { name: 'John' })) // Output: ¡Adiós, John!
```

### Advanced Configuration

```typescript
import { createTranslator } from '@enterprise/shared'

// Define your translation resources
const resources = {
	en: {
		greeting: 'Hello, {name}!',
	},
	fr: {
		greeting: 'Bonjour, {name}!',
	},
}

// Create a translator with custom options
const translator = createTranslator(resources, {
	defaultLanguage: 'fr',
	interpolation: {
		prefix: '{',
		suffix: '}',
	},
})

// Translate a key
console.log(translator.translate('greeting', { name: 'John' })) // Output: Bonjour, John!
```

### Adding Resources Dynamically

```typescript
import { createTranslator } from '@enterprise/shared'

// Create a translator with initial resources
const translator = createTranslator({
	en: {
		greeting: 'Hello, {{name}}!',
	},
})

// Add more resources later
translator.addResources({
	en: {
		farewell: 'Goodbye, {{name}}!',
	},
	fr: {
		greeting: 'Bonjour, {{name}}!',
		farewell: 'Au revoir, {{name}}!',
	},
})

// Now you can use the new resources
translator.setLanguage('fr')
console.log(translator.translate('farewell', { name: 'John' })) // Output: Au revoir, John!
```

## API Reference

### `createTranslator(resources, options?)`

Creates a new translator instance.

#### Parameters

- `resources`: Translation resources mapping language codes to dictionaries of key-value pairs.
- `options` (optional): Configuration options for the translator.

#### Returns

A new `Translator` instance.

### `Translator` Class

#### Methods

##### `getLanguage()`

Gets the current language code.

##### `setLanguage(language)`

Sets the current language.

##### `addResources(resources)`

Adds or updates translation resources.

##### `translate(key, params?, language?)`

Translates a key with optional parameters and language override.

##### `t(key, params?, language?)`

Alias for `translate`.

## Types

### `TranslationResources`

```typescript
type TranslationResources = Record<LanguageCode, TranslationDictionary>
```

### `TranslationDictionary`

```typescript
type TranslationDictionary = Record<string, string>
```

### `LanguageCode`

```typescript
type LanguageCode = string
```

### `TranslationOptions`

```typescript
interface TranslationOptions {
	defaultLanguage?: LanguageCode
	interpolation?: {
		prefix?: string
		suffix?: string
	}
}
```
