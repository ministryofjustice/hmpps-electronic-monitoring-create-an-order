import InterestedPartiesCheckYourAnswersPage from '../../e2e/order/interested-parties/check-your-answers/interestedPartiesCheckYourAnswersPage'
import NotifyingOrganisationPage from '../../e2e/order/interested-parties/notifying-organisation/notifyingOrganisationPage'
import ProbationDeliveryUnitPage from '../../e2e/order/interested-parties/probation-delivery-unit/probationDeliveryUnitPage'
import ResponsibleOfficerPage from '../../e2e/order/interested-parties/responsible-officer/responsibleOfficerPage'
import ResponsibleOrganisationPage from '../../e2e/order/interested-parties/responsible-organisation/responsibleOrganisationPage'

import Page from '../../pages/page'

export default function fillInInterestedPartiesWith({
  notifyingOrganisation,
  responsibleOfficer = null,
  responsibleOrganisation = null,
  pdu = null,
  continueOnCya = true,
}): void {
  const notifyingOrganisationPage = Page.verifyOnPage(NotifyingOrganisationPage)
  notifyingOrganisationPage.form.fillInWith(notifyingOrganisation)
  notifyingOrganisationPage.form.continueButton.click()

  if (responsibleOfficer) {
    const responsibleOfficerPage = Page.verifyOnPage(ResponsibleOfficerPage)
    responsibleOfficerPage.form.fillInWith(responsibleOfficer)
    responsibleOfficerPage.form.continueButton.click()
  }

  if (responsibleOrganisation) {
    const responsibleOrganisationPage = Page.verifyOnPage(ResponsibleOrganisationPage)
    responsibleOrganisationPage.form.fillInWith(responsibleOrganisation)
    responsibleOrganisationPage.form.continueButton.click()
  }

  if (pdu) {
    const pduPage = Page.verifyOnPage(ProbationDeliveryUnitPage)
    pduPage.form.continueButton.click()
  }

  const cyaPage = Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)
  if (continueOnCya === true) {
    cyaPage.form.continueButton.click()
  }
}
