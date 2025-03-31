export const PRIORITY_P1 = "P1" as const
export const PRIORITY_P2 = "P2" as const
export const PRIORITY_P3 = "P3" as const
export const PRIORITY_P4 = "P4" as const

export type Priority = typeof PRIORITY_P1 | typeof PRIORITY_P2 | typeof PRIORITY_P3 | typeof PRIORITY_P4

export type TodoItem = {
  uuid: string,
  title: string
  done: boolean
  group: string // gruop uuid
  expiration?: number // 到期时间
  priority: Priority // 优先级
}

export type Group = {
  uuid: string
  name: string
}