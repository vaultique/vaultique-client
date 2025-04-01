export const DEFAULT_CHECKBOX_SIZE = 'middle'

export const THEME_PRIMARY = 'primary' as const
export const THEME_SUCCESS = 'success' as const
export const THEME_ERROR = 'error' as const
export const THEME_WARNING = 'warning' as const

export type Theme = typeof THEME_PRIMARY | typeof THEME_SUCCESS | typeof THEME_ERROR | typeof THEME_WARNING
