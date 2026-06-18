import { useMemo, useState } from 'react'
import { IconTrash, IconPencil, IconSearch, IconInbox } from '@tabler/icons-react'
import { CATEGORIES, STATUSES, CAT_COLORS, type Subscription, type Settings, type Category, type SubStatus } from '../types'
import { formatDate } from '../utils/dates'
import { cycleLabel } from '../utils/money'
import { getSampleData } from '../utils/sampleData'
import { EmptyState } from './EmptyState'
import { ConfirmDialog } from './ConfirmDialog'

interface Props {
  subs: Subscription[]
  settings: Settings
  view: 'monthly' | 'yearly'
  onEdit: (sub: Subscription) => void
  onDelete: (id: number) => void
  onLoadSamples: (samples: Subscription[]) => void
  onAddFirst: () => void
}

type SortKey = 'name' | 'price' | 'date' | 'cat'

const STATUS_LABELS: Record<SubStatus, string> = {
  active: 'Active',
  trial: 'Trial',
  paused: 'Paused',
}

export function SubscriptionList({ subs, settings, onEdit, onDelete, onLoadSamples, onAddFirst }: Props) {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<Category | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<SubStatus | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [pendingDelete, setPendingDelete] = useState<Subscription | null>(null)

  const filtered = useMemo(() => {
    return subs
      .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
      .filter(s => catFilter === 'all' || s.cat === catFilter)
      .filter(s => statusFilter === 'all' || s.status === statusFilter)
      .sort((a, b) => {
        if (sortKey === 'name') return a.name.localeCompare(b.name)
        if (sortKey === 'price') return b.price - a.price
        if (sortKey === 'cat') return a.cat.localeCompare(b.cat)
        return (a.date || '').localeCompare(b.date || '')
      })
  }, [subs, search, catFilter, statusFilter, sortKey])

  const hasFilters = search !== '' || catFilter !== 'all' || statusFilter !== 'all'

  if (subs.length === 0) {
    return (
      <div className="card" style={{ marginBottom: '1rem' }}>
        <EmptyState
          icon={<IconInbox size={28} stroke={1.5} />}
          title="No subscriptions yet"
          subtext="Add your first subscription to start tracking what you're paying for."
          actions={[
            { label: 'Add subscription', onClick: onAddFirst, primary: true },
            { label: 'Load sample data', onClick: () => onLoadSamples(getSampleData()) },
          ]}
        />
      </div>
    )
  }

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div className="section-hdr">
        <h2 className="section-title">All subscriptions</h2>
      </div>

      <div className="filter-bar">
        <div className="search-input">
          <IconSearch size={14} stroke={1.5} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search subscriptions…"
            aria-label="Search subscriptions"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select aria-label="Filter by category" value={catFilter} onChange={e => setCatFilter(e.target.value as Category | 'all')}>
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select aria-label="Filter by status" value={statusFilter} onChange={e => setStatusFilter(e.target.value as SubStatus | 'all')}>
          <option value="all">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <select aria-label="Sort by" value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}>
          <option value="date">Sort: Next billing</option>
          <option value="name">Sort: Name</option>
          <option value="price">Sort: Price</option>
          <option value="cat">Sort: Category</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<IconSearch size={24} stroke={1.5} />}
          title="No matches"
          subtext="Try a different search term or clear your filters."
          actions={[{ label: 'Clear filters', onClick: () => { setSearch(''); setCatFilter('all'); setStatusFilter('all') }, primary: true }]}
        />
      ) : (
        <div className="sub-rows">
          {filtered.map(s => (
            <div key={s.id} className={`sub-row${s.status === 'paused' ? ' is-paused' : ''}`}>
              <button type="button" className="sub-row-main" onClick={() => onEdit(s)} aria-label={`Edit ${s.name || 'subscription'}`}>
                <span className="sub-dot" aria-hidden="true" style={{ background: CAT_COLORS[s.cat] }} />
                <div className="sub-name-block">
                  <span className="sub-name">{s.name || 'Untitled'}</span>
                  <span className="sub-meta">{s.cat} · {formatDate(s.date)}</span>
                </div>
                <span className="sub-price">{settings.currency}{s.price.toFixed(2)}{cycleLabel(s)}</span>
                {s.status !== 'active' && (
                  <span className={`status-badge status-${s.status}`}>{STATUS_LABELS[s.status]}</span>
                )}
              </button>
              <div className="sub-actions">
                <button className="icon-btn" onClick={() => onEdit(s)} aria-label="Edit subscription">
                  <IconPencil size={15} stroke={1.5} />
                </button>
                <button className="del-btn" onClick={() => setPendingDelete(s)} aria-label="Remove subscription">
                  <IconTrash size={15} stroke={1.5} />
                </button>
              </div>
            </div>

          ))}
        </div>
      )}

      {hasFilters && filtered.length > 0 && (
        <div className="filter-summary">{filtered.length} of {subs.length} shown</div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Remove subscription"
          message={`Remove "${pendingDelete.name || 'this subscription'}"? This can't be undone.`}
          onConfirm={() => onDelete(pendingDelete.id)}
          onClose={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}

