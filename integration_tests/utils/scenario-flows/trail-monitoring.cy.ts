import TrailMonitoringPage from "../../pages/order/monitoring-conditions/trail-monitoring"
import Page from "../../pages/page"



export default function fillInTrailMonitoringOrderDetailsWith({ trailMonitoringDetails }): void {
    const trailMonitoringPage = Page.verifyOnPage(TrailMonitoringPage)
    trailMonitoringPage.form.fillInWith(trailMonitoringDetails)
    trailMonitoringPage.form.saveAndContinueButton.click()
  }