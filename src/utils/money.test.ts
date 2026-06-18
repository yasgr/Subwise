import { describe, it, expect } from 'vitest'
import { toMonthlyAmount, cycleLabel } from './money'
import type { Subscription } from '../types'

function makeSub(overrides: Partial<Subscription>): Subscription {
  return {
    id: 1,
    name: 'Test',
    cat: 'Other',
    price: 12,
    cycle: 'monthly',
    date: '2026-01-01',
    status: 'active',
    ...overrides,
  }
}

describe('toMonthlyAmount', () => {
  it('returns the price unchanged for a monthly subscription', () => {
    expect(toMonthlyAmount(makeSub({ price: 9.99, cycle: 'monthly' }))).toBe(9.99)
  })

  it('multiplies weekly price by ~4.345', () => {
    expect(toMonthlyAmount(makeSub({ price: 10, cycle: 'weekly' }))).toBeCloseTo(43.45, 2)
  })

  it('divides quarterly price by 3', () => {
    expect(toMonthlyAmount(makeSub({ price: 30, cycle: 'quarterly' }))).toBeCloseTo(10, 5)
  })

  it('divides yearly price by 12', () => {
    expect(toMonthlyAmount(makeSub({ price: 120, cycle: 'yearly' }))).toBeCloseTo(10, 5)
  })

  it('scales a custom cycle by 30 / customDays', () => {
    expect(toMonthlyAmount(makeSub({ price: 100, cycle: 'custom', customDays: 10 }))).toBeCloseTo(300, 5)
  })

  it('falls back to 30 days for a custom cycle with no customDays', () => {
    expect(toMonthlyAmount(makeSub({ price: 30, cycle: 'custom', customDays: undefined }))).toBeCloseTo(30, 5)
  })
})

describe('cycleLabel', () => {
  it('labels each fixed cycle', () => {
    expect(cycleLabel(makeSub({ cycle: 'weekly' }))).toBe('/wk')
    expect(cycleLabel(makeSub({ cycle: 'monthly' }))).toBe('/mo')
    expect(cycleLabel(makeSub({ cycle: 'quarterly' }))).toBe('/qtr')
    expect(cycleLabel(makeSub({ cycle: 'yearly' }))).toBe('/yr')
  })

  it('labels a custom cycle with its day count', () => {
    expect(cycleLabel(makeSub({ cycle: 'custom', customDays: 45 }))).toBe('/45d')
  })

  it('defaults a custom cycle with no day count to 30d', () => {
    expect(cycleLabel(makeSub({ cycle: 'custom', customDays: undefined }))).toBe('/30d')
  })
})
