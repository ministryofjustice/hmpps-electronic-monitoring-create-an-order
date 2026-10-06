import { getMockOrder } from '../../../test/mocks/mockOrder'
import returnReasonsViewModel from './viewModel'

describe('ReturnReasonsViewModel', () => {
  it('groups details from rejected status updates by section', () => {
    const order = getMockOrder({
      statusUpdates: [
        {
          id: 'c4b8f4b9-7c64-4ef0-bc8e-bd0a7a6a8b6a',
          versionId: 'c4b8f4b9-7c64-4ef0-bc8e-bd0a7a6a8b6b',
          status: 'REJECTED',
          datetimeOfStatusChange: '2026-01-01T12:00:00Z',
          statusUpdateReasons: [
            {
              id: 'c4b8f4b9-7c64-4ef0-bc8e-bd0a7a6a8b6c',
              statusUpdateId: 'c4b8f4b9-7c64-4ef0-bc8e-bd0a7a6a8b6a',
              section: 'Monitoring conditions',
              details: 'First reason',
            },
            {
              id: 'c4b8f4b9-7c64-4ef0-bc8e-bd0a7a6a8b6d',
              statusUpdateId: 'c4b8f4b9-7c64-4ef0-bc8e-bd0a7a6a8b6a',
              section: 'Monitoring conditions',
              details: 'Second reason',
            },
          ],
        },
      ],
    })

    expect(returnReasonsViewModel.construct(order, `/order/${order.id}/summary`).sections).toEqual([
      { heading: 'Monitoring conditions', details: ['First reason', 'Second reason'] },
    ])
  })

  it('ignores non-rejected updates and nullable details', () => {
    const order = getMockOrder({ statusUpdates: null })

    expect(returnReasonsViewModel.construct(order, `/order/${order.id}/summary`).sections).toEqual([])
  })
})
