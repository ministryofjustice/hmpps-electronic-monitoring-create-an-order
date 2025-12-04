import { VersionInformation } from '../VersionInformation'
import TimelineModel from './timelineModel'

describe('TimelinePresenter', () => {
  const createMockVersion = (overrides: Partial<VersionInformation> = {}): VersionInformation => ({
    orderId: '123',
    fmsResultDate: '2023-10-05T10:00:00Z',
    submittedBy: 'John Doe',
    type: 'REQUEST',
    status: 'SUBMITTED',
    versionId: '456',
    versionNumber: 0,
    ...overrides,
  })

  describe('mapToTimelineItems', () => {
    it('map to timeline items', () => {
      const versions = [
        createMockVersion({ submittedBy: 'Alice', type: 'VARIATION' }),
        createMockVersion({
          submittedBy: 'Bob',
          fmsResultDate: new Date(2025, 0, 1, 10, 30, 0, 0).toISOString(),
        }),
      ]

      const result = TimelineModel.mapToTimelineItems(versions)

      expect(result).toHaveLength(2)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
      })

      expect(result[1]).toEqual({
        label: { text: 'Form submitted' },
        datetime: { timestamp: '2025-01-01T10:30:00.000Z', type: 'datetime' },
        byline: { text: 'Bob' },
      })
    })

    it('returns an empty array if no versions are provided', () => {
      const result = TimelineModel.mapToTimelineItems([])
      expect(result).toEqual([])
    })
  })
})
