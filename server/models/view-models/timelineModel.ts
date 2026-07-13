import paths from '../../constants/paths'
import I18n from '../../types/i18n'
import { ReferenceCatalogDDv6 } from '../../types/i18n/reference'
import { lookup } from '../../utils/utils'
import { VariationTypesEnum, OrderType } from '../Order'
import { VersionInformation } from '../VersionInformation'

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
}

export default class TimelineModel {
  public static mapToTimelineItems = (
    content: I18n,
    versions: VersionInformation[],
    orderId?: string,
    currentVersionId?: string,
  ): TimelineItem[] => {
    return versions
      .map(version => this.mapSingleItem(content, version, orderId, currentVersionId))
      .sort((a, b) => {
        const aTime = a.datetime.timestamp ? new Date(a.datetime.timestamp).getTime() : 0

        const bTime = b.datetime.timestamp ? new Date(b.datetime.timestamp).getTime() : 0

        return bTime - aTime
      })
  }

  private static getTimelineText = (versionInformation: VersionInformation) => {
    if (versionInformation.status === 'IN_PROGRESS') {
      return 'Draft'
    }
    if (versionInformation.type === 'REVOCATION') {
      return 'Monitoring ended'
    }
    if (Object.keys(VariationTypesEnum.Values).includes(versionInformation.type)) {
      return 'Changes submitted'
    }
    if (versionInformation.type === 'REJECTED') {
      return 'Order rejected'
    }
    return versionInformation.status === 'SUBMITTED' ? 'Form submitted' : 'Failed to submit'
  }

  private static mapSingleItem = (
    content: I18n,
    version: VersionInformation,
    orderId?: string,
    currentVersionId?: string,
  ): TimelineItem => {
    const item: TimelineItem = {
      label: {
        text: this.getTimelineText(version),
      },
      text: this.getVariationText(version.type),
      datetime: {
        timestamp: version.fmsResultDate ?? version.lastUpdatedDateTime ?? new Date().toISOString(),
        type: 'datetime',
      },
      notifyingOrganisationDetails: this.getNotifyingOrganisationText(version, content),
      byline: {
        text: version.submittedBy ?? version.lastUpdatedBy,
      },
    }
    if (orderId && currentVersionId && currentVersionId !== version.versionId) {
      item.href = paths.ORDER.SUMMARY_VERSION.replace(':orderId', orderId).replace(':versionId', version.versionId)
    }

    return item
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

  private static getVariationText = (type: OrderType): string | undefined => {
    switch (type) {
      case 'VARIATION': {
        return 'Change to an order'
      }
      case 'REINSTALL_AT_DIFFERENT_ADDRESS': {
        return 'Reinstall at different address'
      }
      case 'REINSTALL_DEVICE': {
        return 'Reinstall device'
      }
      default: {
        return undefined
      }
    }
  }
}
