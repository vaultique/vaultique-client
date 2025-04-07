export const PRIORITY_P1 = 'P1' as const
export const PRIORITY_P2 = 'P2' as const
export const PRIORITY_P3 = 'P3' as const
export const PRIORITY_P4 = 'P4' as const
export type Priority = typeof PRIORITY_P1 | typeof PRIORITY_P2 | typeof PRIORITY_P3 | typeof PRIORITY_P4

export const REPEAT_NONE = 'none' as const
export const REPEAT_WHEN_DONE = 'done' as const
export type Repeat = typeof REPEAT_NONE | typeof REPEAT_WHEN_DONE

export type TodoItem = {
  uuid: string
  title: string
  content: string
  done: boolean
  group: string // gruop uuid
  priority: Priority // 优先级
  repeat: Repeat // 重复模式
  expiration?: number // 到期时间
  doneTime?: number // 完成时间
}

export type Group = {
  uuid: string
  name: string
}

export const TODO_FILTER_NONE = 0 as const
export const TODO_FILTER_TODAY = 1 as const
export const TODO_FILTER_WEEK = 2 as const
export const TODO_FILTER_EXPIRED = -1 as const

export type TodoFilter = typeof TODO_FILTER_NONE | typeof TODO_FILTER_TODAY | typeof TODO_FILTER_WEEK | typeof TODO_FILTER_EXPIRED
