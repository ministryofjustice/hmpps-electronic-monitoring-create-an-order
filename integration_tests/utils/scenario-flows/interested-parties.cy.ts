import InterestedPartiesCheckYourAnswersPage from '../../e2e/order/interested-parties/check-your-answers/interestedPartiesCheckYourAnswersPage'
import NationalSecurityDirectoratePage from '../../e2e/order/interested-parties/national-security-directorate/nationalSecurityDirectoratePage'
import ProbationDeliveryUnitPage from '../../e2e/order/interested-parties/probation-delivery-unit/probationDeliveryUnitPage'
import ResponsibleOfficerPage from '../../e2e/order/interested-parties/responsible-officer/responsibleOfficerPage'
import ResponsibleOrganisationPage from '../../e2e/order/interested-parties/responsible-organisation/responsibleOrganisationPage'

import Page from '../../pages/page'

export default function fillInInterestedPartiesWith({
  responsibleOfficer = undefined,
  responsibleOrganisation = undefined,
  pdu = undefined,
  continueOnCya = true,
}): void {
  if (responsibleOfficer) {
    const responsibleOfficerPage = Page.verifyOnPage(ResponsibleOfficerPage)
    responsibleOfficerPage.form.fillInWith(responsibleOfficer)
    responsibleOfficerPage.form.continueButton.click()
  }

  if (responsibleOrganisation) {
    const responsibleOrganisationPage = Page.verifyOnPage(ResponsibleOrganisationPage)
    responsibleOrganisationPage.form.fillInWith(responsibleOrganisation)
    responsibleOrganisationPage.form.continueButton.click()

    if (responsibleOrganisation.responsibleOrganisation === 'Probation') {
      const nationalSecurityDirectoratePage = Page.verifyOnPage(NationalSecurityDirectoratePage)
      nationalSecurityDirectoratePage.form.fillInWith('No')
      nationalSecurityDirectoratePage.form.continueButton.click()
    }
  }

  if (pdu) {
    const pduPage = Page.verifyOnPage(ProbationDeliveryUnitPage)
    pduPage.form.fillInWith({ unit: pdu })
    pduPage.form.saveAndContinueButton.click()
  }

  const cyaPage = Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)
  if (continueOnCya === true) {
    cyaPage.continueButton().click()
  }
}
