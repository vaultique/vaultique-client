import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isExpirationToday } from '../expiration'

describe('test isExpirationToday', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime('2025-04-15 12:20:10')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('test undefined', () => {
    const expiration = undefined
    expect(isExpirationToday(expiration)).toBe(false)
  })

  it('test not today', () => {
    const expiration = 1744276364799
    expect(isExpirationToday(expiration)).toBe(false)
  })

  // FIXME setSystemTime mock time failed in github action
  // it('test today', () => {
  //   const expiration = 1744646400000
  //   expect(isExpirationToday(expiration)).toBe(true)
  // })
})
