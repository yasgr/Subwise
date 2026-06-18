export function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const d = new Date(dateStr + 'T00:00:00')
  d.setHours(0, 0, 0, 0)
  return Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function formatPrice(price: number, currency: string, view: 'monthly' | 'yearly'): string {
  const amount = view === 'yearly' ? Math.round(price * 12) : price
  return view === 'yearly'
    ? `${currency}${amount.toLocaleString('en-US')}`
    : `${currency}${amount.toFixed(2)}`
}
