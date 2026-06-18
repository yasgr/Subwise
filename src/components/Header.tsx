import { IconSettings, IconPlus } from '@tabler/icons-react'
import type { ViewMode, Theme } from '../types'
import { ThemeToggle } from './ThemeToggle'

interface Props {
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  onToggleSettings: () => void
  onAdd: () => void
  theme: Theme
  onThemeChange: (t: Theme) => void
}

export function Header({ view, onViewChange, onToggleSettings, onAdd, theme, onThemeChange }: Props) {
  return (
    <div className="topbar">
      <h1>Subwise</h1>
      <div className="topbar-right">
        <div className="seg" role="group" aria-label="View period">
          <button
            className={view === 'monthly' ? 'on' : ''}
            aria-pressed={view === 'monthly'}
            onClick={() => onViewChange('monthly')}
          >
            Monthly
          </button>
          <button
            className={view === 'yearly' ? 'on' : ''}
            aria-pressed={view === 'yearly'}
            onClick={() => onViewChange('yearly')}
          >
            Yearly
          </button>
        </div>
        <ThemeToggle theme={theme} onChange={onThemeChange} />
        <button className="icon-btn" onClick={onToggleSettings} aria-label="Settings">
          <IconSettings size={16} stroke={1.5} />
        </button>
        <button className="btn-primary" onClick={onAdd}>
          <IconPlus size={14} stroke={1.5} />
          Add subscription
        </button>
      </div>
    </div>
  )
}
