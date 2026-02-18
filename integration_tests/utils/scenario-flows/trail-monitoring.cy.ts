import MonitoringConditionsCheckYourAnswersPage from '../../pages/order/monitoring-conditions/check-your-answers'
import TrailMonitoringPage from '../../pages/order/monitoring-conditions/trail-monitoring'
import Page from '../../pages/page'

export default function fillInTrailMonitoringOrderDetailsWith(trailMonitoringDetails): void {
  const trailMonitoringPage = Page.verifyOnPage(TrailMonitoringPage)
  trailMonitoringPage.form.fillInWith(trailMonitoringDetails)
  trailMonitoringPage.form.saveAndContinueButton.click()
}

export function verifyTrailMonitoringInCheckYourAnswersPage(trailMonitoringDetails = undefined): void {
  const page = Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage, 'Check your answer')

  if (trailMonitoringDetails) {
    page.trailMonitoringConditionsSection().shouldExist()
    page.trailMonitoringConditionsSection().shouldHaveItems([
      {
        key: 'What date does trail monitoring start?',
        value: trailMonitoringDetails.startDate.toLocaleDateString('en-GB'),
      },
      {
        key: 'What date does trail monitoring end?',
        value: trailMonitoringDetails.endDate.toLocaleDateString('en-GB'),
      },
    ])
  } else {
    page.trailMonitoringConditionsSection().shouldNotExist()
  }
}
