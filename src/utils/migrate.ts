import { CATEGORIES, BILLING_CYCLES, STATUSES, type Subscription, type Settings } from '../types'

export function normalizeSub(raw: unknown): Subscription {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<Subscription>
  return {
    id: typeof r.id === 'number' ? r.id : Date.now(),
    name: typeof r.name === 'string' ? r.name : '',
    cat: r.cat && CATEGORIES.includes(r.cat) ? r.cat : 'Other',
    price: typeof r.price === 'number' && !Number.isNaN(r.price) ? r.price : 0,
    cycle: r.cycle && BILLING_CYCLES.includes(r.cycle) ? r.cycle : 'monthly',
    customDays: typeof r.customDays === 'number' ? r.customDays : undefined,
    date: typeof r.date === 'string' ? r.date : '',
    status: r.status && STATUSES.includes(r.status) ? r.status : 'active',
    notes: typeof r.notes === 'string' ? r.notes : undefined,
  }
}

export function normalizeSettings(raw: unknown, fallback: Settings): Settings {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<Settings>
  return {
    currency: typeof r.currency === 'string' ? r.currency : fallback.currency,
    window: typeof r.window === 'number' ? r.window : fallback.window,
    theme: r.theme === 'light' || r.theme === 'dark' || r.theme === 'system' ? r.theme : fallback.theme,
  }
}
