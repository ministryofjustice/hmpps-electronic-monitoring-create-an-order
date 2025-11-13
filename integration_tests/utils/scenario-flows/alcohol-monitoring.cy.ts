import AlcoholMonitoringPage from '../../pages/order/monitoring-conditions/alcohol-monitoring'
import MonitoringConditionsCheckYourAnswersPage from '../../pages/order/monitoring-conditions/check-your-answers'
import Page from '../../pages/page'

export default function fillInAlcoholMonitoringOrderDetailsWith(alcoholMonitoringDetails) {
  const alcoholMonitoringPage = Page.verifyOnPage(AlcoholMonitoringPage)
  alcoholMonitoringPage.form.fillInWith(alcoholMonitoringDetails)
  alcoholMonitoringPage.form.saveAndContinueButton.click()
}

export function verifyAlcoholMonitoringInCheckYourAnswersPage(alcoholMonitoringDetails = undefined): void {
  const page = Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage, 'Check your answer')

  if (alcoholMonitoringDetails) {
    page.alcoholMonitoringConditionsSection().shouldExist()
    page.alcoholMonitoringConditionsSection().shouldHaveItems([
      {
        key: 'What alcohol monitoring does the device wearer need?',
        value: alcoholMonitoringDetails.monitoringType,
      },
      {
        key: 'What date does alcohol monitoring start?',
        value: alcoholMonitoringDetails.startDate.toLocaleDateString('en-GB'),
      },
      {
        key: 'What date does alcohol monitoring end?',
        value: alcoholMonitoringDetails.endDate.toLocaleDateString('en-GB'),
      },
    ])
  } else {
    page.alcoholMonitoringConditionsSection().shouldNotExist()
  }
}
