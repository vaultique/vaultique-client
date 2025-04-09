const BASE_DIR = 'Nutstore'
const APP_DIR = import.meta.env.DEV ? 'vaultique_test' : 'vaultique'

// log module
const LOG_MODULE_DIR = 'log'
export const LOG_DIR = `${BASE_DIR}\\${APP_DIR}\\${LOG_MODULE_DIR}`

// todo module
const TODO_MODULE_DIR = 'todo'
export const TODO_DIR = `${BASE_DIR}\\${APP_DIR}\\${TODO_MODULE_DIR}`

// document module
const DOCUMENT_MODULE_DIR = 'document'
export const DOCUMENT_DIR = `${BASE_DIR}\\${APP_DIR}\\${DOCUMENT_MODULE_DIR}`

// cache module
const CACHE_MODULE_DIR = 'cache'
export const HTTP_CACHE_DIR = `${BASE_DIR}\\${APP_DIR}\\${CACHE_MODULE_DIR}\\http`
