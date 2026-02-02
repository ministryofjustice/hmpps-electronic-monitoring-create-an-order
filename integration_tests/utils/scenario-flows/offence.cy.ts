import OffenceOtherInfoPage from '../../e2e/order/access-needs-installation-risk/offences/offence-other-info/offenceOtherInfoPage'
import OffencePage from '../../e2e/order/access-needs-installation-risk/offences/offence/offencePage'
import Page from '../../pages/page'

export default function fillInOffenceWith({ offenceDetails, offenceOtherInfo }) {
  const offencePage = Page.verifyOnPage(OffencePage)
  offencePage.form.fillInWith(offenceDetails)
  offencePage.form.saveAndContinueButton.click()

  const offenceOtherInfoPage = Page.verifyOnPage(OffenceOtherInfoPage)
  offenceOtherInfoPage.form.fillInWith(offenceOtherInfo)
  offenceOtherInfoPage.form.saveAndContinueButton.click()
}
