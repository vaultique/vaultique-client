import type { Component } from 'vue'
import { Sunny, Sunrise, Timer } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

export function convertExpiration2Text(expiration: number | undefined): string {
  if (expiration === undefined) {
    return ''
  }
  const today = dayjs().endOf('day').valueOf()
  const diff = expiration - today
  if (diff === 0) {
    return '今天'
  }
  if (diff === 60 * 60 * 24) {
    return '明天'
  }
  if (diff === -60 * 60 * 24) {
    return '昨天'
  }
  return dayjs(expiration).format('YYYY-MM-DD')
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
      expiration = today.endOf('week').valueOf()
      break
  }
  return expiration
}
