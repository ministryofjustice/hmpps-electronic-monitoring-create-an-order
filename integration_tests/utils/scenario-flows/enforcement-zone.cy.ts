import MonitoringConditionsCheckYourAnswersPage from '../../pages/order/monitoring-conditions/check-your-answers'
import EnforcementZonePage from '../../pages/order/monitoring-conditions/enforcement-zone'
import Page from '../../pages/page'

export default function fillInEnforcementZoneOrderDetailsWith(enforcementZoneDetails) {
  const enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
  enforcementZonePage.form.fillInWith(enforcementZoneDetails)
  enforcementZonePage.form.saveAndContinueButton.click()
}

export function verifyEnforcementZoneInCheckYourAnswersPage(enforcementZoneDetails = undefined): void {
  const page = Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage, 'Check your answer')

  if (enforcementZoneDetails) {
    page.exclusionZoneMonitoringSections().shouldExist()
    page.exclusionZoneMonitoringSections().shouldHaveItems([
      {
        key: 'What date does exclusion zone monitoring start?',
        value: enforcementZoneDetails.startDate.toLocaleDateString('en-GB'),
      },
      {
        key: 'What date does exclusion zone monitoring end?',
        value: enforcementZoneDetails.endDate.toLocaleDateString('en-GB'),
      },
      {
        key: 'Where is the exclusion zone?',
        value: enforcementZoneDetails.description,
      },
      {
        key: 'When must the exclusion zone be followed?',
        value: enforcementZoneDetails.duration,
      },
    ])
  } else {
    page.exclusionZoneMonitoringSections().shouldNotExist()
  }
}
