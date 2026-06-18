import { IconCalendarCheck } from '@tabler/icons-react'
import { type Subscription, type Settings, CAT_COLORS } from '../types'
import { daysUntil, formatDate } from '../utils/dates'
import { cycleLabel } from '../utils/money'
import { EmptyState } from './EmptyState'

interface Props {
  subs: Subscription[]
  settings: Settings
  view: 'monthly' | 'yearly'
}

export function UpcomingTimeline({ subs, settings }: Props) {
  const win = settings.window
  const due = subs
    .filter(s => s.status !== 'paused')
    .filter(s => {
      const d = daysUntil(s.date)
      return d !== null && d >= 0 && d <= win
    })
    .sort((a, b) => (daysUntil(a.date) ?? 0) - (daysUntil(b.date) ?? 0))

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div className="section-hdr">
        <h2 className="section-title">Upcoming in {win} days</h2>
      </div>
      {due.length === 0 ? (
        <EmptyState
          icon={<IconCalendarCheck size={24} stroke={1.5} />}
          title="Nothing due soon"
          subtext={`No active subscriptions bill in the next ${win} days.`}
        />
      ) : (
        <div className="timeline">
          {due.map(s => {
            const d = daysUntil(s.date) ?? 0
            const label = d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : `${d}d`
            const badgeClass = d <= 2 ? 'badge-today' : d <= 7 ? 'badge-soon' : 'badge-ok'
            return (
              <div key={s.id} className="tl-item">
                <div className="tl-dot" aria-hidden="true" style={{ background: CAT_COLORS[s.cat] }} />
                <div className="tl-name">{s.name || '—'}</div>
                <div className="tl-date">{formatDate(s.date)}</div>
                <span className={`tl-badge ${badgeClass}`}>{label}</span>
                <div className="tl-price">{settings.currency}{s.price.toFixed(2)}{cycleLabel(s)}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
