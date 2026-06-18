import type { Subscription } from '../types'

const WEEKS_PER_MONTH = 4.345

export function toMonthlyAmount(sub: Subscription): number {
  switch (sub.cycle) {
    case 'weekly': return sub.price * WEEKS_PER_MONTH
    case 'monthly': return sub.price
    case 'quarterly': return sub.price / 3
    case 'yearly': return sub.price / 12
    case 'custom': return sub.price * (30 / Math.max(1, sub.customDays || 30))
  }
}

export function cycleLabel(sub: Subscription): string {
  switch (sub.cycle) {
    case 'weekly': return '/wk'
    case 'monthly': return '/mo'
    case 'quarterly': return '/qtr'
    case 'yearly': return '/yr'
    case 'custom': return `/${sub.customDays || 30}d`
  }
}
