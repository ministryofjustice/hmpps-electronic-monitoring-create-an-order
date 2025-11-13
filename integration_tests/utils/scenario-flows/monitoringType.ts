import MonitoringTypesPage from '../../e2e/order/monitoring-conditions/order-type-description/monitoring-type/MonitoringTypesPage'
import Page from '../../pages/page'
import fillInCurfewOrderDetailsWith from './curfew.cy'
import fillInEnforcementZoneOrderDetailsWith, { fillInEnforcementZoneListItemDetailsWith } from './enforcement-zone.cy'
import fillInTagAtSourceWith from './installation-location.cy'
import fillInAlcoholMonitoringOrderDetailsWith from './alcohol-monitoring.cy'
import fillInTrailMonitoringOrderDetailsWith from './trail-monitoring.cy'
import fillInAttendanceMonitoringDetailsWith from './attendence-monitoring.cy'
import TypesOfMonitoringNeededPage from '../../e2e/order/monitoring-conditions/order-type-description/types-of-monitoring-needed/TypesOfMonitoringNeededPage'

export default function fillInMonitoringTypeWith({
  monitoringType = undefined,
  additionalMonitoringConditions = undefined,
  installationAddressDetails = undefined,
  installationLocation = undefined,
  installationAppointment = undefined,
  curfewReleaseDetails = undefined,
  curfewConditionDetails = undefined,
  curfewTimetable = undefined,
  enforcementZoneDetails = undefined,
  enforcementZoneListItemDetails = undefined,
  alcoholMonitoringDetails = undefined,
  trailMonitoringDetails = undefined,
  attendanceMonitoringDetails = undefined,
}): void {
  if (additionalMonitoringConditions) {
    const typesOfMoinitoringNeededPage = Page.verifyOnPage(TypesOfMonitoringNeededPage)
    typesOfMoinitoringNeededPage.form.fillInWith(additionalMonitoringConditions)
    typesOfMoinitoringNeededPage.form.saveAndContinueButton.click()
  }

  if (monitoringType) {
    const monitoringTypePage = Page.verifyOnPage(MonitoringTypesPage)
    monitoringTypePage.form.fillInWith(monitoringType)
    monitoringTypePage.form.continueButton.click()
  }

  if (curfewReleaseDetails) {
    fillInCurfewOrderDetailsWith({ curfewReleaseDetails, curfewConditionDetails, curfewTimetable })
  }

  if (enforcementZoneDetails) {
    fillInEnforcementZoneOrderDetailsWith(enforcementZoneDetails)
  }

  if (enforcementZoneListItemDetails) {
    fillInEnforcementZoneListItemDetailsWith(enforcementZoneListItemDetails)
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

  if (installationLocation) {
    fillInTagAtSourceWith(installationLocation, installationAppointment, installationAddressDetails)
  }
}
