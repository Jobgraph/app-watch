import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'

vi.mock('./config', () => ({
  loadConfig: vi.fn(),
}))

import { loadConfig } from './config'
const mockLoadConfig = vi.mocked(loadConfig)

describe('App (watch)', () => {
  beforeEach(() => { vi.restoreAllMocks() })

  it('shows not-configured message when isConfigured is false', async () => {
    mockLoadConfig.mockResolvedValue({
      deploymentId: 'local', appName: 'Watch', orgName: 'Test', brandColour: '#6366f1',
      logoUrl: null, systemPrompt: '', capabilities: [], isConfigured: false,
    })
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('This app is not configured. Deploy it from Jobgraph to get started.')).toBeInTheDocument()
    })
  })

  it('renders data input with disabled button when empty', async () => {
    mockLoadConfig.mockResolvedValue({
      deploymentId: 'test-id', appName: 'Watch', orgName: 'Test', brandColour: '#6366f1',
      logoUrl: null, systemPrompt: '', capabilities: [], isConfigured: true,
    })
    render(<App />)
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Paste your data (CSV, metrics, KPIs, or plain text)...')).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'Analyse data' })).toBeDisabled()
  })

  it('renders signals after successful analysis', async () => {
    mockLoadConfig.mockResolvedValue({
      deploymentId: 'test-id', appName: 'Watch', orgName: 'Test', brandColour: '#6366f1',
      logoUrl: null, systemPrompt: '', capabilities: [], isConfigured: true,
    })
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        signals: [
          { severity: 'high', title: 'Revenue drop', detail: 'Down 20%', action: 'Investigate pricing' },
          { severity: 'low', title: 'Sign-ups steady', detail: 'Normal range', action: 'No action' },
        ],
      }),
    }) as any

    render(<App />)
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Paste your data (CSV, metrics, KPIs, or plain text)...')).toBeInTheDocument()
    })
    fireEvent.change(screen.getByPlaceholderText('Paste your data (CSV, metrics, KPIs, or plain text)...'), { target: { value: 'revenue: 14000' } })
    fireEvent.click(screen.getByRole('button', { name: 'Analyse data' }))

    await waitFor(() => {
      expect(screen.getByText('Revenue drop')).toBeInTheDocument()
    })
    expect(screen.getByText('Sign-ups steady')).toBeInTheDocument()
    expect(screen.getByText('Investigate pricing')).toBeInTheDocument()
  })
})
