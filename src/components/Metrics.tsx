import type { Subscription, Settings } from '../types'
import { daysUntil, formatPrice } from '../utils/dates'
import { toMonthlyAmount } from '../utils/money'

interface Props {
  subs: Subscription[]
  settings: Settings
  view: 'monthly' | 'yearly'
}

export function Metrics({ subs, settings, view }: Props) {
  const active = subs.filter(s => s.status !== 'paused')
  const total = active.reduce((a, s) => a + toMonthlyAmount(s), 0)
  const dueThisWeek = active.filter(s => {
    const d = daysUntil(s.date)
    return d !== null && d >= 0 && d <= 7
  })

  return (
    <div className="metrics">
      <div className="metric">
        <div className="lbl">{view === 'yearly' ? 'Yearly' : 'Monthly'} total</div>
        <div className="val">{formatPrice(total, settings.currency, view)}</div>
      </div>
      <div className="metric">
        <div className="lbl">Services</div>
        <div className="val">{subs.length}</div>
      </div>
      <div className="metric">
        <div className="lbl">Due this week</div>
        <div className={`val${dueThisWeek.length > 0 ? ' danger' : ''}`}>
          {dueThisWeek.length}
        </div>
      </div>
    </div>
  )
}
