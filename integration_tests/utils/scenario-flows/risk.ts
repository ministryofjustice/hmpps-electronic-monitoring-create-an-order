import Page from '../../pages/page'
import OrderTasksPage from '../../pages/order/summary'
import InstallationAndRiskCheckYourAnswersPage from '../../pages/order/installation-and-risk/check-your-answers'
import OffencePage from '../../e2e/order/access-needs-installation-risk/offences/offence/offencePage'
import OffenceOtherInfoPage from '../../e2e/order/access-needs-installation-risk/offences/offence-other-info/offenceOtherInfoPage'
import DetailsOfInstallationPage from '../../e2e/order/access-needs-installation-risk/details-of-installation/DetailsOfInstallationPage'
import IsMappaPage from '../../e2e/order/access-needs-installation-risk/is-mappa/IsMappaPage'
import { fillInNewDeviceWearerWith } from './general-order-details'

export function fillInInstallationAndRiskWith({ installationAndRisk, interestedParties }): void {
  if (!installationAndRisk) {
    return
  }

  const { notifyingOrganisation } = interestedParties
  const isCourt = notifyingOrganisation?.includes('Court')

  const detailsOfInstallationPage = Page.verifyOnPage(DetailsOfInstallationPage)
  detailsOfInstallationPage.form.fillInWith({
    possibleRisks: [installationAndRisk.possibleRisk],
    riskCategories: [installationAndRisk.riskCategory],
    riskDetails: installationAndRisk.riskDetails,
  })
  detailsOfInstallationPage.form.saveAndContinueButton.click()

  if (notifyingOrganisation === 'Home Office') {
    const mappaPage = Page.verifyOnPage(IsMappaPage)
    mappaPage.form.fillInWith({ isMappa: 'No' })
    mappaPage.form.saveAndContinueButton.click()
  }

  if (notifyingOrganisation !== 'Home Office' && !isCourt) {
    const offencePage = Page.verifyOnPage(OffencePage)
    offencePage.form.fillInWith({ offenceType: installationAndRisk.offence })
    offencePage.form.saveAndContinueButton.click()

    const offenceDetailsPage = Page.verifyOnPage(OffenceOtherInfoPage)
    offenceDetailsPage.form.fillInWith({ hasOtherInformation: 'No' })
    offenceDetailsPage.form.saveAndContinueButton.click()
  }

  const installationAndRiskCheckYourAnswersPage = Page.verifyOnPage(
    InstallationAndRiskCheckYourAnswersPage,
    'Check your answer',
  )
  installationAndRiskCheckYourAnswersPage.continueButton().click()
}

export function startRiskInformationAfterDeviceWearerWith({ deviceWearerDetails, interestedParties }): void {
  fillInNewDeviceWearerWith({ deviceWearerDetails, interestedParties }).return()
  Page.verifyOnPage(OrderTasksPage).riskInformationTask.click()
}
