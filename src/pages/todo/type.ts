export type TodoItem = {
  uuid: string,
  title: string
  done: boolean
  group: string // gruop uuid
  expiration?: number // 到期时间
}

export type Group = {
  uuid: string
  name: string
}