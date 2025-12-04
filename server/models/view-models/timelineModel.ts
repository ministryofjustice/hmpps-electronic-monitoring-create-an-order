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
}

export default class TimelineModel {
  public static mapToTimelineItems = (versions: VersionInformation[]): TimelineItem[] => {
    return versions.map(this.mapSingleItem)
  }

  private static getTimelineText = (versionInformation: VersionInformation) => {
    if (versionInformation.type === 'VARIATION') {
      return 'Changes submitted'
    }
    return versionInformation.status === 'SUBMITTED' ? 'Form submitted' : 'Failed to submit'
  }

  private static mapSingleItem = (version: VersionInformation): TimelineItem => {
    return {
      label: {
        text: this.getTimelineText(version),
      },
      datetime: {
        timestamp: version.fmsResultDate,
        type: 'datetime',
      },
      byline: {
        text: version.submittedBy,
      },
    }
  }
}
