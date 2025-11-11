import AlcoholMonitoringPage from '../../pages/order/monitoring-conditions/alcohol-monitoring'
import Page from '../../pages/page'

export default function fillInAlcoholMonitoringOrderDetailsWith({ alcoholMonitoringDetails }) {
  const alcoholMonitoringPage = Page.verifyOnPage(AlcoholMonitoringPage)
  alcoholMonitoringPage.form.fillInWith(alcoholMonitoringDetails)
  alcoholMonitoringPage.form.saveAndContinueButton.click()
}
