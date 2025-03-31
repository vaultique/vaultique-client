const BASE_DIR = "BaiduSyncdisk"
const APP_DIR = import.meta.env.DEV ? "vaultique_test" : "vaultique"

// log module
const LOG_MODULE_DIR = "log"
export const LOG_DIR = `${BASE_DIR}\\${APP_DIR}\\${LOG_MODULE_DIR}`

// todo module
const TODO_MODULE_DIR = "todo"
export const TODO_DIR = `${BASE_DIR}\\${APP_DIR}\\${TODO_MODULE_DIR}`