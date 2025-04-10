import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isExpirationToday } from '../expiration'

describe('test isExpirationToday', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('test undefined', () => {
    const date = new Date(2025, 3, 15, 13)
    vi.setSystemTime(date)

    const expiration = undefined
    expect(isExpirationToday(expiration)).toBe(false)
  })

  it('test not today', () => {
    const date = new Date(2025, 3, 15, 13)
    vi.setSystemTime(date)

    const expiration = 1744276364799
    expect(isExpirationToday(expiration)).toBe(false)
  })

  it('test today', () => {
    const date = new Date(2025, 3, 15, 13)
    vi.setSystemTime(date)

    const expiration = 1744646400000
    expect(isExpirationToday(expiration)).toBe(true)
  })
})
