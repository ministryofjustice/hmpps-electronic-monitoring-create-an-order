import { OrderType } from '../Order'
import { VersionInformation } from '../VersionInformation'
import TimelineModel from './timelineModel'

describe('TimelineModel', () => {
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
        text: 'Change to an order',
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

    it('returns correct item when order is rejected', () => {
      const versions = [
        createMockVersion({
          submittedBy: 'Bob',
          type: 'REJECTED',
        }),
      ]
      const result = TimelineModel.mapToTimelineItems(versions)
      expect(result[0]).toEqual({
        label: { text: 'Order rejected' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Bob' },
      })
    })

    it.each<[OrderType, string]>([
      ['VARIATION', 'Change to an order'],
      ['REINSTALL_AT_DIFFERENT_ADDRESS', 'Reinstall at different address'],
      ['REINSTALL_DEVICE', 'Reinstall device'],
    ])('returns correct timeline text if type is $type', (type, text) => {
      const versions = [createMockVersion({ submittedBy: 'Alice', type })]

      const result = TimelineModel.mapToTimelineItems(versions)

      expect(result[0].text).toBe(text)
    })

    it('returns href for other versions', () => {
      const versions = [
        createMockVersion({
          orderId: 'someOrderId',
          versionId: 'version1',
          versionNumber: 0,
          submittedBy: 'Alice',
          type: 'REQUEST',
        }),
        createMockVersion({
          orderId: 'someOrderId',
          versionId: 'version2',
          versionNumber: 1,
          submittedBy: 'Bob',
          type: 'VARIATION',
        }),
      ]

      const result = TimelineModel.mapToTimelineItems(versions, 'someOrderId', 'version2')

      expect(result[0].href).toBe('/order/someOrderId/version/version1/summary')
      expect(result[1].href).toBeUndefined()
    })

    it('no href when current version is not provided', () => {
      const versions = [
        createMockVersion({
          orderId: 'someOrderId',
          versionId: 'version1',
          versionNumber: 0,
        }),
      ]

      const result = TimelineModel.mapToTimelineItems(versions)

      expect(result[0].href).toBeUndefined()
      expect(result[0].label.text).toBeDefined()
    })
  })
})
