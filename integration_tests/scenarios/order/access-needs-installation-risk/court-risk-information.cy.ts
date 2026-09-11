import DetailsOfInstallationPage from '../../../e2e/order/access-needs-installation-risk/details-of-installation/DetailsOfInstallationPage'
import OffenceOtherInfoPage from '../../../e2e/order/access-needs-installation-risk/offences/offence-other-info/offenceOtherInfoPage'
import OffencePage from '../../../e2e/order/access-needs-installation-risk/offences/offence/offencePage'
import { createFakeAdultDeviceWearer, createFakeInterestedParties } from '../../../mockApis/faker'
import DeviceWearerCheckYourAnswersPage from '../../../pages/order/about-the-device-wearer/check-your-answers'
import InstallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'
import OrderSummaryPage from '../../../pages/order/summary'
import Page from '../../../pages/page'
import fillInAboutTheDeviceWearer from '../../../utils/scenario-flows/about-the-device-wearer-flow.cy'
import createNewOrder from '../../../utils/scenario-flows/create-new-order.cy'

context('Court risk information', () => {
  const deviceWearerDetails = {
    ...createFakeAdultDeviceWearer(),
    disabilities: 'Not able to provide this information',
    interpreterRequired: false,
    language: '',
    hasFixedAddress: 'No',
  }

  const detailsOfInstallation = {
    possibleRisks: ['Violent behaviour or threats of violence'],
    riskCategories: ['Safeguarding child'],
    riskDetails: 'some details',
  }

  const startRiskInformation = (notifyingOrganisation: 'Civil and County Court' | 'Family Court' | 'Prison') => {
    cy.signIn()
    cy.task('setFeatureFlags', { OFFENCE_FLOW_ENABLED: true })
    createNewOrder({
      notifyingOrganisation: createFakeInterestedParties(notifyingOrganisation, 'Prison', undefined, 'North West'),
      stubSignin: false,
    })

    const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    orderSummaryPage.aboutTheDeviceWearerTask.click()
    fillInAboutTheDeviceWearer({
      deviceWearerDetails,
    })
    const deviceWearerCheckYourAnswersPage = Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')
    cy.task('setFeatureFlags', { OFFENCE_FLOW_ENABLED: true })
    deviceWearerCheckYourAnswersPage.continue()
  }

  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')
    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'COURT'],
    })
  })

  after(() => {
    cy.task('resetFeatureFlags')
  })

  it('skips offence pages for Civil Court', () => {
    startRiskInformation('Civil and County Court')

    const detailsOfInstallationPage = Page.verifyOnPage(DetailsOfInstallationPage)
    cy.get('#offence').should('not.exist')
    detailsOfInstallationPage.form.fillInWith(detailsOfInstallation)
    detailsOfInstallationPage.form.saveAndContinueButton.click()

    const cyaPage = Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answer')
    // Do not render fixed offence on cya for court
    cyaPage.installationRiskSection.shouldNotHaveItem('Offences')
  })

  it('skips offence and DAPO clause pages for Family Court', () => {
    startRiskInformation('Family Court')

    const detailsOfInstallationPage = Page.verifyOnPage(DetailsOfInstallationPage)
    cy.get('#offence').should('not.exist')
    detailsOfInstallationPage.form.fillInWith(detailsOfInstallation)
    detailsOfInstallationPage.form.saveAndContinueButton.click()

    const cyaPage = Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answer')
    cyaPage.installationRiskSection.shouldNotHaveItem('Offences')
    cyaPage.installationRiskSection.shouldNotHaveItem('DAPO order clauses')
  })

  it('shows every standard Risk Information page for Prison', () => {
    startRiskInformation('Prison')

    const detailsOfInstallationPage = Page.verifyOnPage(DetailsOfInstallationPage)
    cy.get('#offence').should('not.exist')
    detailsOfInstallationPage.form.fillInWith(detailsOfInstallation)
    detailsOfInstallationPage.form.saveAndContinueButton.click()

    const offencePage = Page.verifyOnPage(OffencePage)
    offencePage.form.fillInWith({ offenceType: 'Criminal damage and arson' })
    offencePage.form.saveAndContinueButton.click()

    const offenceOtherInfoPage = Page.verifyOnPage(OffenceOtherInfoPage)
    offenceOtherInfoPage.form.fillInWith({ hasOtherInformation: 'No' })
    offenceOtherInfoPage.form.saveAndContinueButton.click()

    const cyaPage = Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answer')
    cyaPage.installationRiskSection.shouldHaveItem(
      'What type of offence did the device wearer commit?',
      'Criminal damage and arson',
    )
    cyaPage.installationRiskSection.shouldHaveItem(
      'Any other information to be aware of about the offence committed?',
      '',
    )
  })
})
