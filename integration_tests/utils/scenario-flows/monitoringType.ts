import MonitoringTypesPage from '../../e2e/order/monitoring-conditions/order-type-description/monitoring-type/MonitoringTypesPage'
import Page from '../../pages/page'
import fillInCurfewOrderDetailsWith from './curfew.cy'
import fillInEnforcementZoneOrderDetailsWith from './enforcement-zone.cy'
import fillInInsllationLocationWith from './installation-location.cy'
import fillInAlcoholMonitoringOrderDetailsWith from './alcohol-monitoring.cy'
import fillInTrailMonitoringOrderDetailsWith from './trail-monitoring.cy'
import fillInAttendanceMonitoringDetailsWith from './attendence-monitoring.cy'

export default function fillInMonitoringTypeWith({
  monitoringType,
  installationAddressDetails = undefined,
  installationLocation = undefined,
  installationAppointment = undefined,
  curfewReleaseDetails = undefined,
  curfewConditionDetails = undefined,
  curfewTimetable = undefined,
  enforcementZoneDetails = undefined,
  alcoholMonitoringDetails = undefined,
  trailMonitoringDetails = undefined,
  attendanceMonitoringDetails = undefined,
}): void {
  const monitoringTypePage = Page.verifyOnPage(MonitoringTypesPage)
  monitoringTypePage.form.fillInWith(monitoringType)

  if (installationLocation) {
    fillInInsllationLocationWith({ installationLocation, installationAppointment, installationAddressDetails })
  }

  if (curfewReleaseDetails) {
    fillInCurfewOrderDetailsWith({ curfewReleaseDetails, curfewConditionDetails, curfewTimetable })
  }

  if (enforcementZoneDetails) {
    fillInEnforcementZoneOrderDetailsWith(enforcementZoneDetails)
  }

  if (alcoholMonitoringDetails) {
    fillInAlcoholMonitoringOrderDetailsWith(alcoholMonitoringDetails)
  }

  if (trailMonitoringDetails) {
    fillInTrailMonitoringOrderDetailsWith(trailMonitoringDetails)
  }

  if (attendanceMonitoringDetails) {
    fillInAttendanceMonitoringDetailsWith(attendanceMonitoringDetails)
  }
}
