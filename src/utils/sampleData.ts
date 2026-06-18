import type { Subscription } from '../types'

function nextBillingDate(day: number): string {
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth(), day)
  if (d <= now) d.setMonth(d.getMonth() + 1)
  return d.toISOString().split('T')[0]
}

export function getSampleData(): Subscription[] {
  return [
    { id: 1, name: 'Netflix', cat: 'Entertainment', price: 17.99, cycle: 'monthly', date: nextBillingDate(5), status: 'active' },
    { id: 2, name: 'Spotify', cat: 'Music', price: 20.99, cycle: 'monthly', date: nextBillingDate(12), notes: 'shared with family', status: 'active' },
    { id: 3, name: 'iCloud', cat: 'Cloud', price: 2.99, cycle: 'monthly', date: nextBillingDate(20), status: 'active' },
    { id: 4, name: 'Amazon Prime', cat: 'Other', price: 95, cycle: 'yearly', date: nextBillingDate(28), status: 'active' },
    { id: 5, name: 'New Yorker', cat: 'News', price: 0, cycle: 'monthly', date: nextBillingDate(15), status: 'trial' },
  ]
}
