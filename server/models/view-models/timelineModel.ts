import paths from '../../constants/paths'
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
  byline: {
    text: string | null | undefined
  }
  text?: string
  href?: string
}

export default class TimelineModel {
  public static mapToTimelineItems = (
    versions: VersionInformation[],
    orderId?: string,
    currentVersionId?: string,
  ): TimelineItem[] => {
    return versions.map(version => this.mapSingleItem(version, orderId, currentVersionId))
  }

  private static getTimelineText = (versionInformation: VersionInformation) => {
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
        timestamp: version.fmsResultDate,
        type: 'datetime',
      },
      byline: {
        text: version.submittedBy,
      },
    }

    if (orderId && currentVersionId && currentVersionId !== version.versionId) {
      item.href = paths.ORDER.SUMMARY_VERSION.replace(':orderId', orderId).replace(':versionId', version.versionId)
    }

    return item
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
