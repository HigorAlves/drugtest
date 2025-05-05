import { describe, expect, it } from 'vitest'

import { createTranslator, Translator } from './translator'
import type { TranslationResources } from './types'

describe('Translator', () => {
	const resources: TranslationResources = {
		en: {
			hello: 'Hello',
			greeting: 'Hello, {{name}}!',
			items: 'You have {{count}} items',
		},
		fr: {
			hello: 'Bonjour',
			greeting: 'Bonjour, {{name}}!',
			// 'items' key is intentionally missing to test fallback
		},
	}

	it('should create a translator instance', () => {
		const translator = createTranslator(resources)
		expect(translator).toBeInstanceOf(Translator)
	})

	it('should use default language (en) when initialized', () => {
		const translator = createTranslator(resources)
		expect(translator.getLanguage()).toBe('en')
		expect(translator.translate('hello')).toBe('Hello')
	})

	it('should use custom default language when specified', () => {
		const translator = createTranslator(resources, { defaultLanguage: 'fr' })
		expect(translator.getLanguage()).toBe('fr')
		expect(translator.translate('hello')).toBe('Bonjour')
	})

	it('should change language', () => {
		const translator = createTranslator(resources)
		translator.setLanguage('fr')
		expect(translator.getLanguage()).toBe('fr')
		expect(translator.translate('hello')).toBe('Bonjour')
	})

	it('should interpolate variables', () => {
		const translator = createTranslator(resources)
		expect(translator.translate('greeting', { name: 'John' })).toBe('Hello, John!')
		expect(translator.translate('items', { count: 5 })).toBe('You have 5 items')
	})

	it('should use t() as an alias for translate()', () => {
		const translator = createTranslator(resources)
		expect(translator.t('greeting', { name: 'John' })).toBe('Hello, John!')
	})

	it('should fall back to default language when translation is missing', () => {
		const translator = createTranslator(resources)
		translator.setLanguage('fr')
		expect(translator.translate('items', { count: 5 })).toBe('You have 5 items')
	})

	it('should return the key when translation is not found in any language', () => {
		const translator = createTranslator(resources)
		expect(translator.translate('nonexistent')).toBe('nonexistent')
	})

	it('should use custom interpolation delimiters', () => {
		const customResources: TranslationResources = {
			en: {
				greeting: 'Hello, {name}!',
			},
		}

		const translator = createTranslator(customResources, {
			interpolation: {
				prefix: '{',
				suffix: '}',
			},
		})

		expect(translator.translate('greeting', { name: 'John' })).toBe('Hello, John!')
	})

	it('should add resources dynamically', () => {
		const translator = createTranslator(resources)

		translator.addResources({
			en: {
				farewell: 'Goodbye, {{name}}!',
			},
			de: {
				hello: 'Hallo',
				greeting: 'Hallo, {{name}}!',
			},
		})

		expect(translator.translate('farewell', { name: 'John' })).toBe('Goodbye, John!')

		translator.setLanguage('de')
		expect(translator.translate('greeting', { name: 'John' })).toBe('Hallo, John!')
	})

	it('should handle language change to non-existent language', () => {
		const translator = createTranslator(resources)

		// This should log a warning and keep the default language
		translator.setLanguage('nonexistent')

		expect(translator.getLanguage()).toBe('en')
		expect(translator.translate('hello')).toBe('Hello')
	})

	it('should handle empty resources', () => {
		const translator = createTranslator({})

		expect(translator.translate('hello')).toBe('hello')
	})
})
