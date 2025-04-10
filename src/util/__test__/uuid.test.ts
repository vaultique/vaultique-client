import { expect, it } from 'vitest'
import { validateUuid } from '../uuid'

// TODO 补充更多的测试用例

it('validate uuid', () => {
  const param = '020121eb-16eb-4c29-8862-b509bf39f074'
  expect(validateUuid(param)).toBeTruthy()
})

it('invalidate uuid, uuid should not be number', () => {
  const param = 1 as any
  expect(validateUuid(param)).toBeFalsy()
})

it('invalidate uuid, uuid should not be object', () => {
  const param = { uuid: '757dd529-87fc-4dfa-bf0f-268aefc5d1de' } as any
  expect(validateUuid(param)).toBeFalsy()
})

it('invalidate uuid, uuid should not be boolean', () => {
  const param = false as any
  expect(validateUuid(param)).toBeFalsy()
})

it('invalidate uuid, uuid should v4', () => {
  const param = '857dd529987fc-4dfa-bf0f-268aefc5d1de'
  expect(validateUuid(param)).toBeFalsy()
})
