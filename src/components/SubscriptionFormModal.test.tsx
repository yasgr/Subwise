import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SubscriptionFormModal } from './SubscriptionFormModal'

describe('SubscriptionFormModal', () => {
  it('shows validation errors and does not submit when name and price are empty', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<SubscriptionFormModal onSubmit={onSubmit} onClose={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /add subscription/i }))

    expect(await screen.findByText('Service name is required.')).toBeInTheDocument()
    expect(screen.getByText('Enter a valid price (0 or more).')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits with the entered values once name and price are valid', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<SubscriptionFormModal onSubmit={onSubmit} onClose={vi.fn()} />)

    await user.type(screen.getByPlaceholderText('e.g. Netflix'), 'My Service')
    await user.type(screen.getByRole('spinbutton'), '12.50')
    await user.click(screen.getByRole('button', { name: /add subscription/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ name: 'My Service', price: 12.5, cycle: 'monthly', status: 'active' })
  })

  it('allows an empty price when status is Trial, defaulting it to 0', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<SubscriptionFormModal onSubmit={onSubmit} onClose={vi.fn()} />)

    await user.type(screen.getByPlaceholderText('e.g. Netflix'), 'Trial Service')
    await user.selectOptions(screen.getByLabelText('Status'), 'trial')
    await user.click(screen.getByRole('button', { name: /add subscription/i }))

    expect(screen.queryByText('Enter a valid price (0 or more).')).not.toBeInTheDocument()
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ name: 'Trial Service', price: 0, status: 'trial' })
  })

  it('still requires a valid price when status is not Trial', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<SubscriptionFormModal onSubmit={onSubmit} onClose={vi.fn()} />)

    await user.type(screen.getByPlaceholderText('e.g. Netflix'), 'Active Service')
    await user.click(screen.getByRole('button', { name: /add subscription/i }))

    expect(await screen.findByText('Enter a valid price (0 or more).')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('suggests a popular service and auto-fills its category on selection', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<SubscriptionFormModal onSubmit={onSubmit} onClose={vi.fn()} />)

    await user.type(screen.getByPlaceholderText('e.g. Netflix'), 'Net')
    const option = await screen.findByRole('option', { name: /netflix/i })
    await user.click(option);

    expect(screen.getByPlaceholderText('e.g. Netflix')).toHaveValue('Netflix')
    expect(screen.getByLabelText('Category')).toHaveValue('Entertainment')
  })

  it('lets a keyboard-only user select a suggestion with Arrow keys + Enter', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<SubscriptionFormModal onSubmit={onSubmit} onClose={vi.fn()} />)

    const nameInput = screen.getByPlaceholderText('e.g. Netflix')
    await user.type(nameInput, 'Spo')
    await screen.findByRole('option', { name: /spotify/i })

    await user.keyboard('{ArrowDown}')
    expect(nameInput).toHaveAttribute('aria-activedescendant')
    await user.keyboard('{Enter}')

    expect(nameInput).toHaveValue('Spotify')
    expect(screen.getByLabelText('Category')).toHaveValue('Music')
    // Enter selected the suggestion rather than submitting the form
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('pre-fills the form when editing an existing subscription', () => {
    render(
      <SubscriptionFormModal
        initial={{
          id: 1,
          name: 'Existing Sub',
          cat: 'Cloud',
          price: 5,
          cycle: 'yearly',
          date: '2026-01-01',
          status: 'paused',
        }}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />
    )

    expect(screen.getByPlaceholderText('e.g. Netflix')).toHaveValue('Existing Sub')
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
  })
})
