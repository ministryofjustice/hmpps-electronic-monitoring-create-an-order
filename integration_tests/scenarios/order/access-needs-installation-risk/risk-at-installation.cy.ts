import OffencePage from '../../../e2e/order/access-needs-installation-risk/offences/offence/offencePage'
import { createFakeAdultDeviceWearer, createFakeInterestedParties } from '../../../mockApis/faker'
import DeviceWearerCheckYourAnswersPage from '../../../pages/order/about-the-device-wearer/check-your-answers'
import InstallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'
import OrderSummaryPage from '../../../pages/order/summary'
import Page from '../../../pages/page'
import fillInAboutTheDeviceWearer from '../../../utils/scenario-flows/about-the-device-wearer-flow.cy'
import createNewOrder from '../../../utils/scenario-flows/create-new-order.cy'
import fillInRiskAtInstallationWith from '../../../utils/scenario-flows/risk-at-installation.cy'

context('Risk at installation single question pages', () => {
  const deviceWearerDetails = {
    ...createFakeAdultDeviceWearer(),
    disabilities: 'Not able to provide this information',
    interpreterRequired: false,
    language: '',
    hasFixedAddress: 'No',
  }

  const riskAtInstallation = {
    possibleRisk: 'Violent behaviour or threats of violence',
    riskCategory: 'Safeguarding child',
  }

  const startRiskInformation = (notifyingOrganisation: 'Civil and County Court' | 'Prison') => {
    cy.signIn()
    createNewOrder({
      notifyingOrganisation: createFakeInterestedParties(notifyingOrganisation, 'Prison', undefined, 'North West'),
      stubSignin: false,
    })

    Page.verifyOnPage(OrderSummaryPage).aboutTheDeviceWearerTask.click()
    fillInAboutTheDeviceWearer({ deviceWearerDetails, notifyingOrganisation })
    Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer').return()

    Page.verifyOnPage(OrderSummaryPage).riskInformationTask.click()
  }

  beforeEach(() => {
    cy.task('setFeatureFlags', { RISK_INFORMATION_FLOW_ENABLED: true })
    cy.task('resetDB')
    cy.task('reset')
    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'COURT'],
    })
  })

  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  it('saves the risks and goes to check your answers for Civil Court', () => {
    startRiskInformation('Civil and County Court')

    fillInRiskAtInstallationWith(riskAtInstallation)

    const cyaPage = Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answer')
    cyaPage.installationRiskSection.shouldHaveItem(
      "At installation what are the possible risks from the device wearer's behaviour?",
      riskAtInstallation.possibleRisk,
    )
    cyaPage.installationRiskSection.shouldHaveItem(
      'At installation what are the possible risks at the address?',
      riskAtInstallation.riskCategory,
    )
  })

  it('saves the sex or gender risk details and shows them on check your answers', () => {
    startRiskInformation('Civil and County Court')

    fillInRiskAtInstallationWith({
      possibleRisk: 'Offensive towards someone because of their sex or gender',
      riskCategory: riskAtInstallation.riskCategory,
      genderRiskDetails: 'Women',
    })

    const cyaPage = Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answer')
    cyaPage.installationRiskSection.shouldHaveItem('What sex or gender are they a risk to?', 'Women')
  })

  it('saves the risks and goes to the offence page for Prison', () => {
    startRiskInformation('Prison')

    fillInRiskAtInstallationWith(riskAtInstallation)

    Page.verifyOnPage(OffencePage)
  })
})
