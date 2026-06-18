import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SubscriptionList } from './SubscriptionList'
import type { Settings, Subscription } from '../types'

const settings: Settings = { currency: '€', window: 30, theme: 'light' }

const subs: Subscription[] = [
  { id: 1, name: 'Netflix', cat: 'Entertainment', price: 17.99, cycle: 'monthly', date: '2026-07-04', status: 'active' },
  { id: 2, name: 'Spotify', cat: 'Music', price: 10.99, cycle: 'monthly', date: '2026-07-11', status: 'active' },
  { id: 3, name: 'iCloud', cat: 'Cloud', price: 2.99, cycle: 'monthly', date: '2026-06-19', status: 'paused' },
]

function renderList(overrideSubs: Subscription[] = subs) {
  const onEdit = vi.fn()
  const onDelete = vi.fn()
  const onLoadSamples = vi.fn()
  const onAddFirst = vi.fn()
  render(
    <SubscriptionList
      subs={overrideSubs}
      settings={settings}
      view="monthly"
      onEdit={onEdit}
      onDelete={onDelete}
      onLoadSamples={onLoadSamples}
      onAddFirst={onAddFirst}
    />
  )
  return { onEdit, onDelete, onLoadSamples, onAddFirst }
}

describe('SubscriptionList', () => {
  it('shows an empty state with no subscriptions, and "Load sample data" loads samples', async () => {
    const { onLoadSamples, onAddFirst } = renderList([])
    const user = userEvent.setup()

    expect(screen.getByText('No subscriptions yet')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Load sample data' }))
    expect(onLoadSamples).toHaveBeenCalledTimes(1)
    expect(onLoadSamples.mock.calls[0][0].length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: 'Add subscription' }))
    expect(onAddFirst).toHaveBeenCalledTimes(1)
  })

  it('renders a row for each subscription', () => {
    renderList()
    expect(screen.getByText('Netflix')).toBeInTheDocument()
    expect(screen.getByText('Spotify')).toBeInTheDocument()
    expect(screen.getByText('iCloud')).toBeInTheDocument()
  })

  it('filters rows by the search input', async () => {
    renderList()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Search subscriptions'), 'Net')

    expect(screen.getByText('Netflix')).toBeInTheDocument()
    expect(screen.queryByText('Spotify')).not.toBeInTheDocument()
  })

  it('shows a "No matches" empty state when the filter excludes everything, with a way to clear it', async () => {
    renderList()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Search subscriptions'), 'nonexistent service')
    expect(screen.getByText('No matches')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByText('Netflix')).toBeInTheDocument()
  })

  it('opens the edit callback when a row is activated', async () => {
    const { onEdit } = renderList()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /edit netflix/i }))
    expect(onEdit).toHaveBeenCalledWith(subs[0])
  })

  it('asks for confirmation before deleting, and only deletes on confirm', async () => {
    const { onDelete } = renderList()
    const user = userEvent.setup()

    const netflixRow = screen.getByText('Netflix').closest('.sub-row') as HTMLElement
    await user.click(within(netflixRow).getByRole('button', { name: 'Remove subscription' }))
    expect(screen.getByText(/Remove "Netflix"\? This can't be undone\./)).toBeInTheDocument()

    expect(onDelete).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalledWith(1)
  })
})
