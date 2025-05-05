import { ENV } from './env.js'

export const IS_TEST = ENV.NODE_ENV === 'test'
export const IS_DEV = ENV.NODE_ENV === 'development'
export const IS_DEV_OR_TEST = IS_TEST || IS_DEV
