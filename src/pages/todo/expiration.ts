import type { Component } from 'vue'
import { Sunny, Sunrise, Timer } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(weekday)

export function convertExpiration2Text(expiration: number | undefined): string {
  if (expiration === undefined) {
    return ''
  }
  const today = dayjs().endOf('day').valueOf()
  const diff = expiration - today
  if (diff === 0) {
    return '今天'
  }
  if (diff === 60 * 60 * 24 * 1000) {
    return '明天'
  }
  if (diff === -60 * 60 * 24 * 1000) {
    return '昨天'
  }
  return dayjs(expiration).format('YYYY-MM-DD')
}

export function isExpirationToday(expiration: number | undefined): boolean {
  const today = dayjs().endOf('day').valueOf()
  return today === expiration
}

export function isExpirationWeek(expiration: number | undefined): boolean {
  const start = dayjs().startOf('week').valueOf()
  const end = dayjs().endOf('week').valueOf()
  return expiration !== undefined && expiration >= start && expiration <= end
}

export function isExpirationExpired(expiration: number | undefined): boolean {
  const today = dayjs().startOf('day').valueOf()
  return expiration !== undefined && expiration < today
}

export function convertExpiration2Component(expiration: number | undefined): Component | null {
  if (expiration === undefined) {
    return null
  }
  const today = dayjs().endOf('day')
  if (expiration === today.valueOf()) {
    return Sunny
  }
  else if (expiration === today.add(1, 'day').valueOf()) {
    return Sunrise
  }
  else if (expiration === today.endOf('week').valueOf()) {
    return Timer
  }
  return null
}

export function convertexpirationText2Timestamp(text: 'today' | 'tomorror' | 'week-end'): number {
  const today = dayjs().endOf('day')
  let expiration
  switch (text) {
    case 'today':
      expiration = today.valueOf()
      break
    case 'tomorror':
      expiration = today.add(1, 'day').valueOf()
      break
    case 'week-end':
      expiration = dayjs().weekday(7).endOf('day').valueOf()
      break
  }
  return expiration
}
