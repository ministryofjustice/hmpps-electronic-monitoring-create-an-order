import getEnglishContent from '../../i18n/en'
import { OrderType } from '../Order'
import { StatusUpdate } from '../StatusUpdate'
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

  const createMockStatusUpdate = (overrides: Partial<StatusUpdate> = {}): StatusUpdate => ({
    id: 'c4b8f4b9-7c64-4ef0-bc8e-bd0a7a6a8b6a',
    orderId: 'c4b8f4b9-7c64-4ef0-bc8e-bd0a7a6a8b6e',
    orderVersionId: '456',
    orderVersionType: 'REQUEST',
    status: 'REJECTED',
    datetimeOfStatusChange: '2026-01-01T12:00:00Z',
    reasons: [],
    ...overrides,
  })

  const timeline = (versions: VersionInformation[], orderId?: string, currentVersionId?: string) =>
    TimelineModel.mapToTimelineItems(
      content,
      versions.map(version =>
        createMockStatusUpdate({
          orderVersionId: version.versionId,
          orderVersionType: version.type,
          status: 'SUBMITTED',
          datetimeOfStatusChange: version.fmsResultDate ?? '2023-10-05T10:00:00Z',
        }),
      ),
      versions,
      orderId,
      currentVersionId,
    )

  describe('mapToTimelineItems', () => {
    it('map to timeline items', () => {
      const versions = [
        createMockVersion({
          submittedBy: 'Alice',
          versionId: 'alice-version',
          type: 'VARIATION',
          notifyingOrganisation: 'PRISON',
          notifyingOrganisationName: 'WHITEMOOR_PRISON',
        }),
        createMockVersion({
          submittedBy: 'Bob',
          fmsResultDate: new Date(2025, 0, 1, 10, 30, 0, 0).toISOString(),
        }),
      ]

      const result = timeline(versions)

      expect(result).toHaveLength(2)

      expect(result[0]).toEqual({
        label: { text: 'Form submitted' },
        datetime: { timestamp: '2025-01-01T10:30:00.000Z', type: 'datetime' },
        byline: { text: 'Bob' },
        notifyingOrganisationDetails: '',
      })

      expect(result[1]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Other change',
        notifyingOrganisationDetails: 'From Whitemoor Prison',
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

      const result = timeline(versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Other change',
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

      const result = timeline(versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Other change',
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

      const result = timeline(versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Other change',
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

      const result = timeline(versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Other change',
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

      const result = timeline(versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Other change',
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

      const result = timeline(versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Other change',
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

      const result = timeline(versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Other change',
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

      const result = timeline(versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Other change',
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

      const result = timeline(versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Other change',
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

      const result = timeline(versions)

      expect(result).toHaveLength(1)

      expect(result[0]).toEqual({
        label: { text: 'Changes submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Alice' },
        text: 'Other change',
        notifyingOrganisationDetails: 'From Home Office',
      })
    })

    it('returns an empty array if no versions are provided', () => {
      const result = TimelineModel.mapToTimelineItems(content, [], [])
      expect(result).toEqual([])
    })

    it('returns correct item when order is rejected', () => {
      const versions = [
        createMockVersion({
          submittedBy: 'Bob',
          type: 'REJECTED',
        }),
      ]
      const result = timeline(versions)
      expect(result[0]).toEqual({
        label: { text: 'Form submitted' },
        datetime: { timestamp: '2023-10-05T10:00:00Z', type: 'datetime' },
        byline: { text: 'Bob' },
        notifyingOrganisationDetails: '',
      })
    })

    it('maps rejected status updates to returned items, newest first, without using versions', () => {
      const statusUpdates = [
        createMockStatusUpdate({ orderVersionId: 'v1', datetimeOfStatusChange: '2026-01-02T12:00:00Z' }),
        createMockStatusUpdate({
          orderVersionId: 'v2',
          datetimeOfStatusChange: '2026-01-03T12:00:00Z',
          statusUpdatedBy: 'Jane',
        }),
      ]

      const result = TimelineModel.mapToTimelineItems(content, statusUpdates, [createMockVersion()])

      expect(result).toEqual([
        {
          label: { text: 'Form returned' },
          datetime: { timestamp: '2026-01-03T12:00:00Z', type: 'datetime' },
          byline: { text: 'Jane' },
          notifyingOrganisationDetails: '',
        },
        {
          label: { text: 'Form returned' },
          datetime: { timestamp: '2026-01-02T12:00:00Z', type: 'datetime' },
          byline: { text: 'The Electronic Monitoring Service (EMS)' },
          notifyingOrganisationDetails: '',
        },
      ])
    })

    it.each<[StatusUpdate['status'], string]>([
      ['CREATED', 'Draft'],
      ['VERSION_CREATED', 'Draft'],
      ['SUBMITTED', 'Form submitted'],
      ['SUBMISSION_FAILED', 'Failed to submit'],
      ['ACCEPTED', 'Form accepted'],
      ['REJECTED', 'Form returned'],
    ])('labels a %s status update as "%s"', (status, label) => {
      const result = TimelineModel.mapToTimelineItems(content, [createMockStatusUpdate({ status })])

      expect(result[0].label.text).toBe(label)
    })

    it('does not create items for versions without a status update', () => {
      expect(TimelineModel.mapToTimelineItems(content, [], [createMockVersion()])).toEqual([])
    })

    it.each<[OrderType, string]>([
      ['VARIATION', 'Other change'],
      ['REINSTALL_AT_DIFFERENT_ADDRESS', 'Added second or third curfew address'],
      ['REINSTALL_DEVICE', 'Changed primary address'],
      ['REVOCATION', 'Ended (Recall)'],
      ['END_MONITORING', 'Ended'],
    ])('returns correct timeline label if type is $type', (type, text) => {
      const versions = [createMockVersion({ submittedBy: 'Alice', type })]

      const result = timeline(versions)

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

      const result = timeline(versions, 'someOrderId', 'version2')

      expect(result[0].href).toBe('/order/someOrderId/version/version1/summary')
      expect(result[1].href).toBeUndefined()
      expect(result[1].isCurrentVersion).toBe(true)
    })

    it('returns only the latest item of each version, newest first', () => {
      const updates = [
        createMockStatusUpdate({
          orderVersionId: 'v1',
          status: 'CREATED',
          datetimeOfStatusChange: '2026-01-01T09:00:00Z',
        }),
        createMockStatusUpdate({
          orderVersionId: 'v1',
          status: 'SUBMITTED',
          datetimeOfStatusChange: '2026-01-01T10:00:00Z',
        }),
        createMockStatusUpdate({
          orderVersionId: 'v1',
          status: 'REJECTED',
          datetimeOfStatusChange: '2026-01-02T10:00:00Z',
        }),
        createMockStatusUpdate({
          orderVersionId: 'v2',
          status: 'VERSION_CREATED',
          datetimeOfStatusChange: '2026-01-03T09:00:00Z',
        }),
        createMockStatusUpdate({
          orderVersionId: 'v2',
          status: 'SUBMITTED',
          datetimeOfStatusChange: '2026-01-03T10:00:00Z',
        }),
        createMockStatusUpdate({
          orderVersionId: 'v3',
          status: 'VERSION_CREATED',
          datetimeOfStatusChange: '2026-01-04T09:00:00Z',
        }),
      ]

      const result = TimelineModel.mapToTimelineItems(content, updates)

      expect(result.map(item => item.label.text)).toEqual(['Draft', 'Form submitted', 'Form returned'])
      expect(result.map(item => item.datetime.timestamp)).toEqual([
        '2026-01-04T09:00:00Z',
        '2026-01-03T10:00:00Z',
        '2026-01-02T10:00:00Z',
      ])
    })

    it('links every version that is not the current version and marks the current one', () => {
      const updates = [
        createMockStatusUpdate({
          orderVersionId: 'v1',
          status: 'SUBMITTED',
          datetimeOfStatusChange: '2026-01-01T10:00:00Z',
        }),
        createMockStatusUpdate({
          orderVersionId: 'v2',
          status: 'SUBMITTED',
          datetimeOfStatusChange: '2026-01-03T10:00:00Z',
        }),
        createMockStatusUpdate({
          orderVersionId: 'v3',
          status: 'VERSION_CREATED',
          datetimeOfStatusChange: '2026-01-04T09:00:00Z',
        }),
      ]

      const result = TimelineModel.mapToTimelineItems(content, updates, [], 'order1', 'v2')

      expect(result.map(item => item.href)).toEqual([
        '/order/order1/version/v3/summary',
        undefined,
        '/order/order1/version/v1/summary',
      ])
      expect(result.map(item => item.isCurrentVersion)).toEqual([undefined, true, undefined])
    })

    it('no href when current version is not provided', () => {
      const versions = [
        createMockVersion({
          orderId: 'someOrderId',
          versionId: 'version1',
          versionNumber: 0,
        }),
      ]

      const result = timeline(versions)

      expect(result[0].href).toBeUndefined()
      expect(result[0].label.text).toBeDefined()
    })
  })
})
