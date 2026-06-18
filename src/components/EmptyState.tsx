import type { ReactNode } from 'react'

interface Action {
  label: string
  onClick: () => void
  primary?: boolean
}

interface Props {
  icon: ReactNode
  title: string
  subtext?: string
  actions?: Action[]
}

export function EmptyState({ icon, title, subtext, actions }: Props) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">{icon}</div>
      <div className="empty-title">{title}</div>
      {subtext && <div className="empty-subtext">{subtext}</div>}
      {actions && actions.length > 0 && (
        <div className="empty-actions">
          {actions.map(a => (
            <button
              key={a.label}
              className={a.primary ? 'btn-primary' : 'btn-secondary'}
              onClick={a.onClick}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
