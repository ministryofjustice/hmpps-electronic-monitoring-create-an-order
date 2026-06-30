import getEnglishContent from '../../i18n/en'
import { OrderType } from '../Order'
import { VersionInformation } from '../VersionInformation'
import TimelineModel from './timelineModel'

describe('TimelineModel', () => {
  const content = getEnglishContent('DDV6')
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
        createMockVersion({
          submittedBy: 'Alice',
          type: 'VARIATION',
          notifyingOrganisation: 'PRISON',
          notifyingOrganisationName: 'WHITEMOOR_PRISON',
        }),
        createMockVersion({
          submittedBy: 'Bob',
          fmsResultDate: new Date(2025, 0, 1, 10, 30, 0, 0).toISOString(),
        }),
      ]

      const result = TimelineModel.mapToTimelineItems(content, versions)

      expect(result).toHaveLength(2)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Change to an order',
        notifyingOrganisationDetails: 'From Whitemoor Prison',
      })

      expect(result[1]).toEqual({
        label: { text: 'Form submitted' },
        datetime: { timestamp: '2025-01-01T10:30:00.000Z', type: 'datetime' },
        byline: { text: 'Bob' },
        notifyingOrganisationDetails: '',
      })
    })

    it('map orgnisation name for PRISON', () => {
      const versions = [
        createMockVersion({
          submittedBy: 'Alice',
          type: 'VARIATION',
          notifyingOrganisation: 'PRISON',
          notifyingOrganisationName: 'WHITEMOOR_PRISON',
        }),
      ]

      const result = TimelineModel.mapToTimelineItems(content, versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Change to an order',
        notifyingOrganisationDetails: 'From Whitemoor Prison',
      })
    })

    it('map orgnisation name for CIVIL_COUNTY_COURT', () => {
      const versions = [
        createMockVersion({
          submittedBy: 'Alice',
          type: 'VARIATION',
          notifyingOrganisation: 'CIVIL_COUNTY_COURT',
          notifyingOrganisationName: 'BIRKENHEAD_COUNTY_AND_CIVIL_COURT',
        }),
      ]

      const result = TimelineModel.mapToTimelineItems(content, versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Change to an order',
        notifyingOrganisationDetails: 'From Birkenhead County and Civil Court',
      })
    })

    it('map orgnisation name for FAMILY_COURT', () => {
      const versions = [
        createMockVersion({
          submittedBy: 'Alice',
          type: 'VARIATION',
          notifyingOrganisation: 'FAMILY_COURT',
          notifyingOrganisationName: 'BRADFORD_FAMILY_COURT',
        }),
      ]

      const result = TimelineModel.mapToTimelineItems(content, versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Change to an order',
        notifyingOrganisationDetails: 'From Bradford Family Court',
      })
    })

    it('map orgnisation name for MILITARY_COURT', () => {
      const versions = [
        createMockVersion({
          submittedBy: 'Alice',
          type: 'VARIATION',
          notifyingOrganisation: 'MILITARY_COURT',
          notifyingOrganisationName: 'BULFORD_MILITARY_COURT_CENTRE',
        }),
      ]

      const result = TimelineModel.mapToTimelineItems(content, versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Change to an order',
        notifyingOrganisationDetails: 'From Bulford Military Court Centre',
      })
    })

    it('map orgnisation name for YOUTH_COURT', () => {
      const versions = [
        createMockVersion({
          submittedBy: 'Alice',
          type: 'VARIATION',
          notifyingOrganisation: 'YOUTH_COURT',
          notifyingOrganisationName: 'BASILDON_YOUTH_COURT',
        }),
      ]

      const result = TimelineModel.mapToTimelineItems(content, versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Change to an order',
        notifyingOrganisationDetails: 'From Basildon Youth Court',
      })
    })

    it('map orgnisation name for MAGISTRATES_COURT', () => {
      const versions = [
        createMockVersion({
          submittedBy: 'Alice',
          type: 'VARIATION',
          notifyingOrganisation: 'MAGISTRATES_COURT',
          notifyingOrganisationName: 'ANDOVER_MAGISTRATES_COURT',
        }),
      ]

      const result = TimelineModel.mapToTimelineItems(content, versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Change to an order',
        notifyingOrganisationDetails: 'From Andover Magistrates Court',
      })
    })

    it('map orgnisation name for CROWN_COURT', () => {
      const versions = [
        createMockVersion({
          submittedBy: 'Alice',
          type: 'VARIATION',
          notifyingOrganisation: 'CROWN_COURT',
          notifyingOrganisationName: 'CARDIFF_CROWN_COURT',
        }),
      ]

      const result = TimelineModel.mapToTimelineItems(content, versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Change to an order',
        notifyingOrganisationDetails: 'From Cardiff Crown Court',
      })
    })

    it('map orgnisation name for YOUTH_CUSTODY_SERVICE', () => {
      const versions = [
        createMockVersion({
          submittedBy: 'Alice',
          type: 'VARIATION',
          notifyingOrganisation: 'YOUTH_CUSTODY_SERVICE',
          notifyingOrganisationName: 'LONDON',
        }),
      ]

      const result = TimelineModel.mapToTimelineItems(content, versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Change to an order',
        notifyingOrganisationDetails: 'From Youth Custody Service (YCS) - London',
      })
    })

    it('map orgnisation name for PROBATION', () => {
      const versions = [
        createMockVersion({
          submittedBy: 'Alice',
          type: 'VARIATION',
          notifyingOrganisation: 'PROBATION',
          notifyingOrganisationName: 'LONDON',
        }),
      ]

      const result = TimelineModel.mapToTimelineItems(content, versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Change to an order',
        notifyingOrganisationDetails: 'From Probation',
      })
    })

    it('map orgnisation name for HOME_OFFICE', () => {
      const versions = [
        createMockVersion({
          submittedBy: 'Alice',
          type: 'VARIATION',
          notifyingOrganisation: 'HOME_OFFICE',
          notifyingOrganisationName: 'LONDON',
        }),
      ]

      const result = TimelineModel.mapToTimelineItems(content, versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Change to an order',
        notifyingOrganisationDetails: 'From Home Office',
      })
    })

    it('returns an empty array if no versions are provided', () => {
      const result = TimelineModel.mapToTimelineItems(content, [])
      expect(result).toEqual([])
    })

    it('returns correct item when order is rejected', () => {
      const versions = [
        createMockVersion({
          submittedBy: 'Bob',
          type: 'REJECTED',
        }),
      ]
      const result = TimelineModel.mapToTimelineItems(content, versions)
      expect(result[0]).toEqual({
        label: { text: 'Order rejected' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Bob' },
        notifyingOrganisationDetails: '',
      })
    })

    it.each<[OrderType, string]>([
      ['VARIATION', 'Change to an order'],
      ['REINSTALL_AT_DIFFERENT_ADDRESS', 'Reinstall at different address'],
      ['REINSTALL_DEVICE', 'Reinstall device'],
    ])('returns correct timeline text if type is $type', (type, text) => {
      const versions = [createMockVersion({ submittedBy: 'Alice', type })]

      const result = TimelineModel.mapToTimelineItems(content, versions)

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

      const result = TimelineModel.mapToTimelineItems(content, versions, 'someOrderId', 'version2')

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

      const result = TimelineModel.mapToTimelineItems(content, versions)

      expect(result[0].href).toBeUndefined()
      expect(result[0].label.text).toBeDefined()
    })
  })
})
