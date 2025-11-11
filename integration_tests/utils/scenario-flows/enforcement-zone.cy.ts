import EnforcementZonePage from "../../pages/order/monitoring-conditions/enforcement-zone"
import Page from "../../pages/page"


export default function  fillInEnforcementZoneOrderDetailsWith({ enforcementZoneDetails }, checkYourAnswerPage = true) {
    const enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
    enforcementZonePage.form.fillInWith(enforcementZoneDetails)
    enforcementZonePage.form.saveAndContinueButton.click()
  }