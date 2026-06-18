import { describe, it, expect } from 'vitest'
import { normalizeSub, normalizeSettings } from './migrate'
import type { Settings } from '../types'

const fallbackSettings: Settings = { currency: '€', window: 30, theme: 'system' }

describe('normalizeSub', () => {
  it('passes through a fully valid subscription unchanged (aside from optional fields)', () => {
    const valid = {
      id: 5,
      name: 'Netflix',
      cat: 'Entertainment',
      price: 17.99,
      cycle: 'monthly',
      date: '2026-01-01',
      status: 'active',
    }
    expect(normalizeSub(valid)).toEqual(valid)
  })

  it('defaults a missing cycle to monthly and status to active (old-shape data)', () => {
    const oldShape = { id: 1, name: 'Spotify', cat: 'Music', price: 10.99, date: '2026-02-01' }
    const result = normalizeSub(oldShape)
    expect(result.cycle).toBe('monthly')
    expect(result.status).toBe('active')
  })

  it('falls back to "Other" for an unrecognized category', () => {
    expect(normalizeSub({ cat: 'NotARealCategory' }).cat).toBe('Other')
  })

  it('falls back to 0 for a missing or NaN price', () => {
    expect(normalizeSub({}).price).toBe(0)
    expect(normalizeSub({ price: NaN }).price).toBe(0)
  })

  it('falls back to an empty name and date for missing strings', () => {
    const result = normalizeSub({})
    expect(result.name).toBe('')
    expect(result.date).toBe('')
  })

  it('handles completely malformed input (null, array, primitive) without throwing', () => {
    expect(() => normalizeSub(null)).not.toThrow()
    expect(() => normalizeSub('garbage')).not.toThrow()
    expect(() => normalizeSub(42)).not.toThrow()
    expect(normalizeSub(null).status).toBe('active')
  })

  it('drops an invalid customDays but keeps a valid one', () => {
    expect(normalizeSub({ customDays: 'soon' }).customDays).toBeUndefined()
    expect(normalizeSub({ customDays: 45 }).customDays).toBe(45)
  })
})

describe('normalizeSettings', () => {
  it('passes through valid settings unchanged', () => {
    const valid: Settings = { currency: '$', window: 14, theme: 'dark' }
    expect(normalizeSettings(valid, fallbackSettings)).toEqual(valid)
  })

  it('falls back to the provided defaults for missing fields', () => {
    expect(normalizeSettings({}, fallbackSettings)).toEqual(fallbackSettings)
  })

  it('falls back to the provided defaults for an invalid theme value', () => {
    const result = normalizeSettings({ theme: 'rainbow' }, fallbackSettings)
    expect(result.theme).toBe('system')
  })

  it('handles null input without throwing', () => {
    expect(normalizeSettings(null, fallbackSettings)).toEqual(fallbackSettings)
  })
})
