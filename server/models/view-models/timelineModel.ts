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
}

export default class TimelineModel {
  public static mapToTimelineItems = (versions: VersionInformation[]): TimelineItem[] => {
    return versions.map(this.mapSingleItem)
  }

  private static getTimelineText = (versionInformation: VersionInformation) => {
    if (Object.keys(VariationTypesEnum.Values).includes(versionInformation.type)) {
      return 'Changes submitted'
    }
    if (versionInformation.type === 'REJECTED') {
      return 'Order rejected'
    }
    return versionInformation.status === 'SUBMITTED' ? 'Form submitted' : 'Failed to submit'
  }

  private static mapSingleItem = (version: VersionInformation): TimelineItem => {
    return {
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
      case 'REVOCATION': {
        return 'End all monitoring'
      }
      default: {
        return undefined
      }
    }
  }
}
