import { describe, it, expect, vi, afterEach } from 'vitest'
import { daysUntil, formatDate, formatPrice } from './dates'

describe('daysUntil', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns null for an empty date string', () => {
    expect(daysUntil('')).toBeNull()
  })

  it('returns 0 for today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-18T12:00:00'))
    expect(daysUntil('2026-06-18')).toBe(0)
  })

  it('returns a positive count for a future date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-18T12:00:00'))
    expect(daysUntil('2026-06-25')).toBe(7)
  })

  it('returns a negative count for a past date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-18T12:00:00'))
    expect(daysUntil('2026-06-10')).toBe(-8)
  })
})

describe('formatDate', () => {
  it('returns an em dash for an empty date string', () => {
    expect(formatDate('')).toBe('—')
  })

  it('formats a date as day + short month', () => {
    expect(formatDate('2026-03-05')).toBe('5 Mar')
  })
})

describe('formatPrice', () => {
  it('formats a monthly price with two decimals', () => {
    expect(formatPrice(9.5, '€', 'monthly')).toBe('€9.50')
  })

  it('formats a yearly price as price * 12, rounded, with no decimals', () => {
    expect(formatPrice(10, '€', 'yearly')).toBe('€120')
  })

  it('uses locale thousands separators for large yearly totals', () => {
    expect(formatPrice(1000, '$', 'yearly')).toBe('$12,000')
  })
})
