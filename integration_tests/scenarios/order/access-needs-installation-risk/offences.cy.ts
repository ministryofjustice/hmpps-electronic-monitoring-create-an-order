import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer, createFakeInterestedParties } from '../../../mockApis/faker'
import OffencePage from '../../../e2e/order/access-needs-installation-risk/offences/offence/offencePage'
import OffenceOtherInfoPage from '../../../e2e/order/access-needs-installation-risk/offences/offence-other-info/offenceOtherInfoPage'
import InstallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'
import DetailsOfInstallationPage from '../../../e2e/order/access-needs-installation-risk/details-of-installation/DetailsOfInstallationPage'
import IsMappaPage from '../../../e2e/order/access-needs-installation-risk/is-mappa/IsMappaPage'
import createNewOrder from '../../../utils/scenario-flows/create-new-order.cy'

context('offences', () => {
  let orderSummaryPage: OrderSummaryPage
  const testFlags = { OFFENCE_FLOW_ENABLED: true }

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

  beforeEach(() => {
    cy.task('setFeatureFlags', testFlags)
    cy.task('resetDB')
    cy.task('reset')
  })

  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  it('Notifying organisation is Prison, single offence flow', () => {
    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER', 'ROLE_PRISON'],
    })

    createNewOrder({
      notifyingOrganisation: createFakeInterestedParties('Prison', 'Prison', undefined, 'North West'),
    })

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.aboutTheDeviceWearerTask.click()

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      newDeviceWearerFlow: true,
    })

    // Should go to offence page
    const offencePage = Page.verifyOnPage(OffencePage)
    offencePage.form.fillInWith({ offenceType: 'Criminal damage and arson' })
    offencePage.form.saveAndContinueButton.click()
    // Should go to offence other information page
    const offenceOtherInfoPage = Page.verifyOnPage(OffenceOtherInfoPage)
    offenceOtherInfoPage.form.hasOtherInformationField.set('No')
    offenceOtherInfoPage.form.saveAndContinueButton.click()
    // Should go to details of installation page
    const detailsOfInstallationPage = Page.verifyOnPage(DetailsOfInstallationPage)
    cy.get('#offence').should('not.exist')
    detailsOfInstallationPage.form.fillInWith(detailsOfInstallation)
    detailsOfInstallationPage.form.saveAndContinueButton.click()
    // CYA page
    const cyaPage = Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answer')
    cyaPage.installationRiskSection.shouldHaveItems([
      {
        key: 'What type of offence did the device wearer commit?',
        value: 'Criminal damage and arson',
      },
      {
        key: 'Any other information to be aware of about the offence committed?',
        value: '',
      },
      {
        key: "At installation what are the possible risks from the device wearer's behaviour?",
        value: 'Violent behaviour or threats of violence',
      },
      {
        key: 'What are the possible risks at the installation address? (optional)',
        value: 'Safeguarding child',
      },
      {
        key: 'Any other risks to be aware of? (optional)',
        value: 'some details',
      },
    ])
  })

  it('Notifying organisation is Home Office, skips to risk at installation', () => {
    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'HOME_OFFICE'],
    })

    createNewOrder({
      notifyingOrganisation: createFakeInterestedParties('Home Office', 'Prison', undefined, 'North West'),
    })

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.aboutTheDeviceWearerTask.click()

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      newDeviceWearerFlow: true,
    })

    const detailsOfInstallationPage = Page.verifyOnPage(DetailsOfInstallationPage)
    cy.get('#offence').should('not.exist')
    detailsOfInstallationPage.form.fillInWith(detailsOfInstallation)
    detailsOfInstallationPage.form.saveAndContinueButton.click()
    const isMappaPage = Page.verifyOnPage(IsMappaPage)
    isMappaPage.form.fillInWith({ isMappa: 'No' })
    isMappaPage.form.saveAndContinueButton.click()
    const cyaPage = Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answer')
    cyaPage.installationRiskSection.shouldNotHaveItem('What type of offence did the device wearer commit?')
    cyaPage.installationRiskSection.shouldNotHaveItem(
      'Any other information to be aware of about the offence committed?',
    )
    cyaPage.installationRiskSection.shouldNotHaveItem('Offences')
  })
})
