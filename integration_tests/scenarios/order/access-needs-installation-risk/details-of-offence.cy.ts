import DetailsOfInstallationPage from '../../../e2e/order/access-needs-installation-risk/details-of-installation/DetailsOfInstallationPage'
import { createFakeAdultDeviceWearer, createFakeInterestedParties } from '../../../mockApis/faker'
import IndexPage from '../../../pages'
import InstallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'
import OrderSummaryPage from '../../../pages/order/summary'
import Page from '../../../pages/page'
import fillInOffenceWith from '../../../utils/scenario-flows/offence.cy'

context('offences flow', () => {
  let orderSummaryPage: OrderSummaryPage
  const testFlags = { OFFENCE_FLOW_ENABLED: true }

  const deviceWearerDetails = {
    ...createFakeAdultDeviceWearer(),
    disabilities: 'Not able to provide this information',
    interpreterRequired: false,
    language: '',
    hasFixedAddress: 'No',
  }

  const offenceDetails = { offenceType: 'Criminal damage and arson' }
  const offenceOtherInfo = { hasOtherInformation: 'No' }

  beforeEach(() => {
    cy.task('setFeatureFlags', testFlags)
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER', 'ROLE_PRISON'],
    })
    cy.signIn()

    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.newOrderFormButton.click()

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.aboutTheDeviceWearerTask.click()
  })

  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  it('details of installation flow', () => {
    const interestedParties = createFakeInterestedParties('Probation Service', 'Home Office')
    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
    })

    fillInOffenceWith({ offenceDetails, offenceOtherInfo })

    const detailsOfInstallationPage = Page.verifyOnPage(DetailsOfInstallationPage)
    detailsOfInstallationPage.form.fillInWith({
      possibleRisks: ['Violent behaviour or threats of violence'],
      riskCategories: ['Safeguarding child'],
      riskDetails: 'some details',
    })
    detailsOfInstallationPage.form.saveAndContinueButton.click()

    const cyaPage = Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answers')
    cyaPage.installationRiskSection.shouldHaveItem(
      "At installation what are the possible risks from the device wearer's behaviour?",
      'Violent behaviour or threats of violence',
    )
    cyaPage.installationRiskSection.shouldHaveItem(
      'What are the possible risks at the installation address? (optional)',
      'Safeguarding child',
    )
    cyaPage.installationRiskSection.shouldHaveItem('Any other risks to be aware of? (optional)', 'some details')
  })
})
