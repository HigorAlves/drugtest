/**
 * Translation dictionary type
 * Maps keys to translated strings
 */
export type TranslationDictionary = Record<string, string>

/**
 * Language code type
 * ISO 639-1 language codes (e.g., 'en', 'es', 'fr')
 */
export type LanguageCode = string

/**
 * Translation options
 */
export interface TranslationOptions {
	/**
	 * Default language to use when a translation is not found
	 * @default 'en'
	 */
	defaultLanguage?: LanguageCode

	/**
	 * Interpolation options
	 */
	interpolation?: {
		/**
		 * Prefix for interpolation variables
		 * @default '{{'
		 */
		prefix?: string

		/**
		 * Suffix for interpolation variables
		 * @default '}}'
		 */
		suffix?: string
	}
}

/**
 * Translation resources
 * Maps language codes to translation dictionaries
 */
export type TranslationResources = Record<LanguageCode, TranslationDictionary>
