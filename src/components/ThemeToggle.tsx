import { IconSun, IconMoon } from '@tabler/icons-react'
import type { Theme } from '../types'

interface Props {
  theme: Theme
  onChange: (t: Theme) => void
}

export function ThemeToggle({ theme, onChange }: Props) {
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <button
      className="icon-btn"
      onClick={() => onChange(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <IconSun size={16} stroke={1.5} /> : <IconMoon size={16} stroke={1.5} />}
    </button>
  )
}
