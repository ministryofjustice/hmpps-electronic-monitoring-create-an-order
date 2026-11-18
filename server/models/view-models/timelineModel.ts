import paths from '../../constants/paths'
import I18n from '../../types/i18n'
import { ReferenceCatalogDDv6 } from '../../types/i18n/reference'
import { VariationTypesEnum, OrderType } from '../Order'
import { StatusUpdate } from '../StatusUpdate'
import { VersionInformation } from '../VersionInformation'
import { lookup } from '../../utils/views/displayHelpers'

type TimelineItem = {
  label: {
    text: string
  }
  datetime: {
    timestamp: string | null | undefined
    type: 'datetime'
  }
  notifyingOrganisationDetails: string | null | undefined
  byline: {
    text: string | null | undefined
  }
  text?: string
  href?: string
  isCurrentVersion?: boolean
}

export default class TimelineModel {
  public static mapToTimelineItems = (
    content: I18n,
    statusUpdates: StatusUpdate[],
    versions: VersionInformation[] = [],
    orderId?: string,
    currentVersionId?: string,
  ): TimelineItem[] => {
    const sorted = [...statusUpdates].sort(
      (a, b) => new Date(b.datetimeOfStatusChange).getTime() - new Date(a.datetimeOfStatusChange).getTime(),
    )
    const seenVersionIds = new Set<string>()

    return sorted
      .filter(statusUpdate => {
        // Sorted newest first, so the first update seen for a version is its latest
        if (seenVersionIds.has(statusUpdate.orderVersionId)) {
          return false
        }
        seenVersionIds.add(statusUpdate.orderVersionId)
        return true
      })
      .map(statusUpdate => {
        const item = this.mapStatusUpdateItem(
          content,
          statusUpdate,
          versions.find(version => version.versionId === statusUpdate.orderVersionId),
        )

        if (statusUpdate.orderVersionId === currentVersionId) {
          item.isCurrentVersion = true
        } else if (orderId && currentVersionId) {
          item.href = paths.ORDER.SUMMARY_VERSION.replace(':orderId', orderId).replace(
            ':versionId',
            statusUpdate.orderVersionId,
          )
        }

        return item
      })
  }

  private static mapStatusUpdateItem = (
    content: I18n,
    statusUpdate: StatusUpdate,
    version?: VersionInformation,
  ): TimelineItem => {
    const datetime = { timestamp: statusUpdate.datetimeOfStatusChange, type: 'datetime' as const }

    if (statusUpdate.status === 'REJECTED' || statusUpdate.status === 'ACCEPTED') {
      return {
        label: { text: statusUpdate.status === 'REJECTED' ? 'Form returned' : 'Form accepted' },
        datetime,
        notifyingOrganisationDetails: '',
        byline: { text: statusUpdate.statusUpdatedBy ?? 'The Electronic Monitoring Service (EMS)' },
      }
    }

    return {
      label: { text: this.getTimelineText(statusUpdate) },
      text: this.getVariationText(statusUpdate.orderVersionType),
      datetime,
      notifyingOrganisationDetails: version ? this.getNotifyingOrganisationText(version, content) : '',
      byline: { text: statusUpdate.statusUpdatedBy ?? version?.submittedBy ?? version?.lastUpdatedBy },
    }
  }

  private static getTimelineText = (statusUpdate: StatusUpdate) => {
    switch (statusUpdate.status) {
      case 'CREATED':
      case 'VERSION_CREATED':
        return 'Draft'
      case 'SUBMISSION_FAILED':
        return 'Failed to submit'
      default:
        if (statusUpdate.orderVersionType === 'REVOCATION') {
          return 'Monitoring ended'
        }
        if (Object.keys(VariationTypesEnum.enum).includes(statusUpdate.orderVersionType)) {
          return 'Changes submitted'
        }
        return 'Form submitted'
    }
  }

  private static getNotifyingOrganisationText = (version: VersionInformation, content: I18n): string => {
    const { notifyingOrganisationName } = version

    switch (version.notifyingOrganisation) {
      case 'CIVIL_COUNTY_COURT':
        return `From ${lookup((content.reference as ReferenceCatalogDDv6).civilCountyCourts, notifyingOrganisationName)}`
      case 'FAMILY_COURT':
        return `From ${lookup((content.reference as ReferenceCatalogDDv6).familyCourts, notifyingOrganisationName)}`
      case 'MILITARY_COURT':
        return `From ${lookup((content.reference as ReferenceCatalogDDv6).militaryCourts, notifyingOrganisationName)}`
      case 'YOUTH_COURT':
        return `From ${lookup((content.reference as ReferenceCatalogDDv6).youthCourts, notifyingOrganisationName)}`
      case 'MAGISTRATES_COURT':
        return `From ${lookup(content.reference.magistratesCourts, notifyingOrganisationName)}`
      case 'CROWN_COURT':
        return `From ${lookup(content.reference.crownCourts, notifyingOrganisationName)}`
      case 'PRISON':
        return `From ${lookup(content.reference.prisons, notifyingOrganisationName)}`
      case 'YOUTH_CUSTODY_SERVICE':
        return `From Youth Custody Service (YCS) - ${lookup(content.reference.youthCustodyServiceRegions, notifyingOrganisationName)}`
      case 'HOME_OFFICE':
        return 'From Home Office'
      case 'PROBATION':
        return 'From Probation'
      default:
        return ''
    }
  }

  private static getVariationText = (type: OrderType | StatusUpdate['orderVersionType']): string | undefined => {
    switch (type) {
      case 'VARIATION':
        return 'Other change'
      case 'REINSTALL_AT_DIFFERENT_ADDRESS':
        return 'Added second or third curfew address'
      case 'REINSTALL_DEVICE':
        return 'Changed primary address'
      case 'REVOCATION':
        return 'Ended (Recall)'
      case 'END_MONITORING':
        return 'Ended'
      default:
        return undefined
    }
  }
}
