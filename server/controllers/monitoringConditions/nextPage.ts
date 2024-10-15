import paths from '../../constants/paths'
import { MonitoringConditions } from '../../models/MonitoringConditions'

const monitoringTypes: (keyof MonitoringConditions)[] = [
  'curfew',
  'exclusionZone',
  'trail',
  'mandatoryAttendance',
  'alcohol',
]

const pathLookup: Record<string, string> = {
  curfew: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE,
  exclusionZone: paths.MONITORING_CONDITIONS.ZONE,
  trail: paths.MONITORING_CONDITIONS.TRAIL,
  mandatoryAttendance: paths.MONITORING_CONDITIONS.ATTENDANCE,
  alcohol: paths.MONITORING_CONDITIONS.ALCOHOL,
}

export const getSelectedMonitoringTypes = (monitoringConditions: MonitoringConditions): string[] =>
  monitoringTypes.reduce((acc: string[], val) => {
    if (monitoringConditions[val]) {
      acc.push(val)
    }
    return acc
  }, [])

const nextPage = (selection: string[], currentPage?: keyof MonitoringConditions): string => {
  if (selection.length === 0) {
    return paths.ORDER.SUMMARY
  }
  const orderedSelection = monitoringTypes.filter(t => selection.includes(t))

  if (!currentPage) {
    return pathLookup[orderedSelection[0]]
  }

  if (currentPage === orderedSelection.at(-1)) {
    return paths.ORDER.SUMMARY
  }

  const nextPageId = orderedSelection[orderedSelection.indexOf(currentPage) + 1]
  return pathLookup[nextPageId]
}

export default nextPage
