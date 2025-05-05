import 'winston-daily-rotate-file'

import * as process from 'node:process'

import winston from 'winston'
import LokiTransport from 'winston-loki'

const addErrorStackAndMeta = winston.format((info) => {
	if (info.stack) {
		info.message += `\n${info.stack}`
	}
	if (info.meta) {
		info.message += ` | ${JSON.stringify(info.meta)}`
	}
	return info
})

const customLogFormat = winston.format.printf(({ level, message, label, timestamp }) => {
	const paddedLabel = (label as string).padEnd(13, ' ')
	return `${timestamp} [${paddedLabel}] | ${level}: ${message}`
})

export function createLogger(customLabel?: string) {
	const isProdEnv = process.env.NODE_ENV === 'production'
	const isSandbox = process.env.NODE_ENV === 'staging'
	const label = customLabel ?? 'UNDEFINED-LOGGER'

	const consoleFormat = winston.format.combine(
		winston.format.label({ label }),
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		winston.format.errors({ stack: true }),
		addErrorStackAndMeta(),
		winston.format.colorize({ all: true }),
		winston.format.align(),
		customLogFormat
	)

	const fileTransport = new winston.transports.DailyRotateFile({
		filename: 'logs/application-%DATE%.log',
		datePattern: 'YYYY-MM-DD',
		zippedArchive: true,
		maxSize: '20m',
		maxFiles: '14d',
		level: process.env.LOG_LEVEL || 'info',
	})

	const lokiTransport = new LokiTransport({
		host: process.env.GRAFANA_LOKI_HOST || 'http://localhost:3100',
		labels: { app: 'enterprise', package: label, enviroment: process.env.NODE_ENV },
		json: true,
		format: winston.format.json(),
		level: process.env.LOG_LEVEL || 'info',
		onConnectionError: (err) => console.error(err),
	})

	let selectedTransports
	let selectedFormat
	if (isProdEnv) {
		selectedTransports = [fileTransport, lokiTransport]
		selectedFormat = winston.format.json()
	} else if (isSandbox) {
		selectedTransports = [lokiTransport, new winston.transports.Console()]
		selectedFormat = winston.format.json()
	} else {
		selectedTransports = [new winston.transports.Console()]
		selectedFormat = consoleFormat
	}

	return winston.createLogger({
		level: process.env.LOG_LEVEL || 'info',
		format: selectedFormat,
		defaultMeta: { service: customLabel ?? 'general' },
		transports: selectedTransports,
	})
}
