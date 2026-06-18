import type { Subscription, Settings } from '../types'
import { normalizeSub, normalizeSettings } from './migrate'
import { DEFAULT_SETTINGS } from './defaults'

export function exportData(subs: Subscription[], settings: Settings) {
  const payload = { subs, settings, exportedAt: new Date().toISOString() }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `subwise-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importData(file: File): Promise<{ subs: Subscription[]; settings: Settings }> {
  return file.text().then(text => {
    const parsed = JSON.parse(text) as { subs?: unknown[]; settings?: unknown }
    const subs = Array.isArray(parsed.subs) ? parsed.subs.map(normalizeSub) : []
    const settings = normalizeSettings(parsed.settings, DEFAULT_SETTINGS)
    return { subs, settings }
  })
}
