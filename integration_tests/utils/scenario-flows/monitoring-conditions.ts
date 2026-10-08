import Page from '../../pages/page'
import MonitoringConditionsCheckYourAnswersPage from '../../pages/order/monitoring-conditions/check-your-answers'
import TypesOfMonitoringNeededPage from '../../e2e/order/monitoring-conditions/order-type-description/types-of-monitoring-needed/TypesOfMonitoringNeededPage'
import MonitoringTypePage from '../../e2e/order/monitoring-conditions/order-type-description/monitoring-type/MonitoringTypesPage'
import fillInCurfewOrderDetailsWith from './curfew.cy'
import { fillInEnforcementZoneListItemDetailsWith } from './enforcement-zone.cy'
import fillInAlcoholMonitoringOrderDetailsWith from './alcohol-monitoring.cy'
import fillInTrailMonitoringOrderDetailsWith from './trail-monitoring.cy'
import fillInAttendanceMonitoringDetailsWith from './attendance-monitoring.cy'

export function continueFromMonitoringConditionsCya(): void {
  Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage, 'Check your answer').continueButton().click()
}

function answerTypesOfMonitoringNeeded(addAnother: 'Yes' | 'No'): void {
  const typesOfMonitoringNeededPage = Page.verifyOnPage(TypesOfMonitoringNeededPage)
  typesOfMonitoringNeededPage.form.fillInWith(addAnother)
  typesOfMonitoringNeededPage.form.saveAndContinueButton.click()
}

function selectMonitoringType(condition: string): void {
  const monitoringTypePage = Page.verifyOnPage(MonitoringTypePage)
  monitoringTypePage.form.fillInWith(condition)
  monitoringTypePage.form.continueButton.click()
}

export function fillInMonitoringConditionsWith({
  conditions,
  curfewConditionDetails,
  curfewReleaseDetails,
  curfewTimetable,
  enforcementZoneDetails,
  restrictionZoneDetails,
  secondEnforcementZoneDetails,
  alcoholMonitoringDetails,
  trailMonitoringDetails,
  attendanceMonitoringDetails,
}): void {
  conditions.forEach((condition: string, index: number) => {
    selectMonitoringType(condition)

    if (condition === 'Curfew') {
      fillInCurfewOrderDetailsWith({ curfewConditionDetails, curfewReleaseDetails, curfewTimetable })
    }

    if (condition === 'Exclusion zone monitoring') {
      fillInEnforcementZoneListItemDetailsWith(enforcementZoneDetails, 'exclusion')
      if (secondEnforcementZoneDetails) {
        answerTypesOfMonitoringNeeded('Yes')
        selectMonitoringType(condition)
        fillInEnforcementZoneListItemDetailsWith(secondEnforcementZoneDetails, 'exclusion')
      }
    }

    if (condition === 'Restriction zone monitoring') {
      fillInEnforcementZoneListItemDetailsWith(restrictionZoneDetails, 'restriction')
    }

    if (condition === 'Trail monitoring') {
      fillInTrailMonitoringOrderDetailsWith(trailMonitoringDetails)
    }

    if (condition === 'Alcohol monitoring') {
      fillInAlcoholMonitoringOrderDetailsWith(alcoholMonitoringDetails)
    }

    if (condition === 'Mandatory attendance monitoring') {
      fillInAttendanceMonitoringDetailsWith(attendanceMonitoringDetails)
    }

    answerTypesOfMonitoringNeeded(index === conditions.length - 1 ? 'No' : 'Yes')
  })
}
