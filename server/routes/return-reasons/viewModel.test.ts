import { StatusUpdate } from '../../models/StatusUpdate'
import returnReasonsViewModel from './viewModel'

const createStatusUpdate = (overrides: Partial<StatusUpdate> = {}): StatusUpdate => ({
  id: 'c4b8f4b9-7c64-4ef0-bc8e-bd0a7a6a8b6a',
  orderId: 'c4b8f4b9-7c64-4ef0-bc8e-bd0a7a6a8b6e',
  orderVersionId: 'c4b8f4b9-7c64-4ef0-bc8e-bd0a7a6a8b6b',
  orderVersionType: 'REQUEST',
  status: 'REJECTED',
  datetimeOfStatusChange: '2026-01-01T12:00:00Z',
  reasons: [],
  ...overrides,
})

describe('ReturnReasonsViewModel', () => {
  it('groups details from rejected status updates by section', () => {
    const statusUpdates = [
      createStatusUpdate({
        reasons: [
          { section: 'Monitoring conditions', details: 'First reason' },
          { section: 'Monitoring conditions', details: 'Second reason' },
        ],
      }),
    ]

    expect(returnReasonsViewModel.construct(statusUpdates, '/order/1/summary').sections).toEqual([
      { heading: 'Monitoring conditions', details: ['First reason', 'Second reason'] },
    ])
  })

  it('ignores non-rejected updates and missing details', () => {
    const statusUpdates = [
      createStatusUpdate({ status: 'ACCEPTED', reasons: [{ section: 'Accepted section', details: 'Ignored' }] }),
      createStatusUpdate({ reasons: [{ section: 'Section', details: null }] }),
    ]

    expect(returnReasonsViewModel.construct(statusUpdates, '/order/1/summary').sections).toEqual([])
  })
})
