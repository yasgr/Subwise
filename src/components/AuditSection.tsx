import { IconAlertTriangle, IconInfoCircle, IconFlame, IconChartBar } from '@tabler/icons-react'
import { type Subscription, type Settings, CAT_COLORS, CAT_TEXT } from '../types'
import { toMonthlyAmount } from '../utils/money'
import { EmptyState } from './EmptyState'

interface Props {
  subs: Subscription[]
  settings: Settings
}

interface Flag {
  type: 'warning' | 'danger' | 'info'
  text: string
}

function FlagIcon({ type }: { type: Flag['type'] }) {
  if (type === 'danger') return <IconFlame size={15} stroke={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
  if (type === 'warning') return <IconAlertTriangle size={15} stroke={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
  return <IconInfoCircle size={15} stroke={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
}

export function AuditSection({ subs, settings }: Props) {
  const active = subs.filter(s => s.status !== 'paused')

  if (!active.length) {
    return (
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="section-hdr">
          <h2 className="section-title">Insights</h2>
        </div>
        <EmptyState
          icon={<IconChartBar size={24} stroke={1.5} />}
          title="No insights yet"
          subtext="Add a subscription to see spending breakdown and savings flags."
        />
      </div>
    )
  }

  const monthly = active.reduce((a, s) => a + toMonthlyAmount(s), 0)

  const byCat: Record<string, number> = {}
  active.forEach(s => { byCat[s.cat] = (byCat[s.cat] || 0) + toMonthlyAmount(s) })
  const catEntries = Object.entries(byCat).sort((a, b) => b[1] - a[1])
  const maxCat = catEntries[0]?.[1] || 1

  const catCounts: Record<string, number> = {}
  active.forEach(s => { catCounts[s.cat] = (catCounts[s.cat] || 0) + 1 })

  const flags: Flag[] = []
  if ((catCounts['Entertainment'] || 0) >= 3)
    flags.push({ type: 'warning', text: `You have ${catCounts['Entertainment']} entertainment services — a lot of potential overlap.` })
  if ((catCounts['Music'] || 0) >= 2)
    flags.push({ type: 'warning', text: 'Multiple music services detected. You may be paying for the same library twice.' })
  active.filter(s => toMonthlyAmount(s) >= 20).forEach(s =>
    flags.push({ type: 'info', text: `${s.name} is ${settings.currency}${toMonthlyAmount(s).toFixed(2)}/mo — make sure you use it regularly.` })
  )
  if (monthly > 100)
    flags.push({ type: 'danger', text: `${settings.currency}${monthly.toFixed(2)}/month adds up to ${settings.currency}${Math.round(monthly * 12)} a year.` })

  return (
    <div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="section-hdr">
          <h2 className="section-title">Spending by category</h2>
        </div>
        {catEntries.map(([cat, amt]) => (
          <div key={cat} className="bar-row">
            <div className="bar-cat">{cat}</div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${Math.round((amt / maxCat) * 100)}%`,
                  background: CAT_COLORS[cat as keyof typeof CAT_COLORS] || '#888',
                  color: CAT_TEXT[cat as keyof typeof CAT_TEXT] || '#222',
                }}
              >
                {Math.round((amt / monthly) * 100)}%
              </div>
            </div>
            <div className="bar-amt">{settings.currency}{amt.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {flags.length > 0 && (
        <div className="flags">
          {flags.map((f, i) => (
            <div key={i} className={`flag ${f.type}`}>
              <FlagIcon type={f.type} />
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
