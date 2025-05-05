import { LanguageCode, TranslationOptions, TranslationResources } from './types'

/**
 * Default translation options
 */
const DEFAULT_OPTIONS: Required<TranslationOptions> = {
	defaultLanguage: 'en',
	interpolation: {
		prefix: '{{',
		suffix: '}}',
	},
}

/**
 * Translator class for handling translations
 */
export class Translator {
	private resources: TranslationResources
	private currentLanguage: LanguageCode
	private options: Required<TranslationOptions>

	/**
	 * Create a new Translator instance
	 * @param resources Translation resources
	 * @param options Translation options
	 */
	constructor(resources: TranslationResources, options: TranslationOptions = {}) {
		this.resources = resources
		this.options = { ...DEFAULT_OPTIONS, ...options }
		this.currentLanguage = this.options.defaultLanguage
	}

	/**
	 * Get the current language
	 */
	public getLanguage(): LanguageCode {
		return this.currentLanguage
	}

	/**
	 * Set the current language
	 * @param language Language code
	 */
	public setLanguage(language: LanguageCode): void {
		if (!this.resources[language]) {
			console.warn(`Language '${language}' is not available. Using default language.`)
			this.currentLanguage = this.options.defaultLanguage
			return
		}
		this.currentLanguage = language
	}

	/**
	 * Add or update translation resources
	 * @param resources Translation resources to add or update
	 */
	public addResources(resources: TranslationResources): void {
		this.resources = {
			...this.resources,
			...resources,
		}
	}

	/**
	 * Translate a key
	 * @param key Translation key
	 * @param params Parameters for interpolation
	 * @param language Optional language override
	 * @returns Translated string
	 */
	public translate(key: string, params: Record<string, string | number> = {}, language?: LanguageCode): string {
		const lang = language || this.currentLanguage
		const dictionary = this.resources[lang] || this.resources[this.options.defaultLanguage]

		if (!dictionary) {
			console.warn(`No translations available for language '${lang}' or default language.`)
			return key
		}

		let translation = dictionary[key]

		if (!translation) {
			// Try to find the translation in the default language
			if (lang !== this.options.defaultLanguage) {
				translation = this.resources[this.options.defaultLanguage]?.[key]
			}

			if (!translation) {
				console.warn(`Translation key '${key}' not found.`)
				return key
			}
		}

		// Interpolate parameters
		return this.interpolate(translation, params)
	}

	/**
	 * Alias for translate
	 */
	public t(key: string, params: Record<string, string | number> = {}, language?: LanguageCode): string {
		return this.translate(key, params, language)
	}

	/**
	 * Interpolate parameters in a string
	 * @param text Text to interpolate
	 * @param params Parameters for interpolation
	 * @returns Interpolated string
	 */
	private interpolate(text: string, params: Record<string, string | number>): string {
		const { prefix, suffix } = this.options.interpolation
		let result = text

		Object.entries(params).forEach(([key, value]) => {
			const regex = new RegExp(`${prefix}\\s*${key}\\s*${suffix}`, 'g')
			result = result.replace(regex, String(value))
		})

		return result
	}
}

/**
 * Create a new translator instance
 * @param resources Translation resources
 * @param options Translation options
 * @returns Translator instance
 */
export function createTranslator(resources: TranslationResources, options?: TranslationOptions): Translator {
	return new Translator(resources, options)
}
