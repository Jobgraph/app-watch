import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'

vi.mock('./lib/config', () => ({
  loadConfig: vi.fn(),
  _resetConfigCache: vi.fn(),
}))

import { loadConfig } from './lib/config'
const mockLoadConfig = vi.mocked(loadConfig)

describe('App (watch)', () => {
  beforeEach(() => { vi.restoreAllMocks() })

  it('shows not-configured message when isConfigured is false and not local', async () => {
    mockLoadConfig.mockResolvedValue({
      deploymentId: 'test-id', appName: 'Watch', orgName: 'Test', brandColour: '#6366f1',
      logoUrl: null, systemPrompt: '', capabilities: [], isConfigured: false,
    })
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('This app is not yet configured. Deploy it from Jobgraph to get started.')).toBeInTheDocument()
    })
  })

  it('renders the app shell when configured', async () => {
    mockLoadConfig.mockResolvedValue({
      deploymentId: 'test-id', appName: 'Watch', orgName: 'Test', brandColour: '#6366f1',
      logoUrl: null, systemPrompt: '', capabilities: [], isConfigured: true,
    })
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Watch')).toBeInTheDocument()
    })
  })

  it('renders the app shell in local dev mode even if not configured', async () => {
    mockLoadConfig.mockResolvedValue({
      deploymentId: 'local', appName: 'Watch', orgName: 'Your Organisation', brandColour: '#6366f1',
      logoUrl: null, systemPrompt: '', capabilities: [], isConfigured: false,
    })
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Watch')).toBeInTheDocument()
    })
    // Should NOT show the "not configured" gate
    expect(screen.queryByText('This app is not yet configured. Deploy it from Jobgraph to get started.')).not.toBeInTheDocument()
  })
})
