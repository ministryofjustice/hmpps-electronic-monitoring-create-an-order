import MappaPage from '../../../e2e/order/access-needs-installation-risk/mappa/MappaPage'
import { createFakeAdultDeviceWearer, createFakeInterestedParties } from '../../../mockApis/faker'
import IndexPage from '../../../pages'
import InstallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'
import OrderSummaryPage from '../../../pages/order/summary'
import Page from '../../../pages/page'
import fillInOffenceWith from '../../../utils/scenario-flows/offence.cy'

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

  const offenceDetails = { offenceType: 'Criminal damage and arson' }
  const offenceOtherInfo = { hasOtherInformation: 'No' }

  const installationAndRisk = {
    offence: 'Sexual offences',
    possibleRisk: 'Sex offender',
    riskCategory: 'Children under the age of 18 are living at the property',
    riskDetails: 'No risk',
  }

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

  it('Notifying organisation is Home Office, mappa flow', () => {
    const interestedParties = createFakeInterestedParties('Home Office', 'Home Office')
    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
    })

    fillInOffenceWith({ offenceDetails, offenceOtherInfo, installationAndRisk })

    const mappaPage = Page.verifyOnPage(MappaPage)
    mappaPage.form.fillInWith({ level: 'MAPPA 1', category: 'Category 1' })
    mappaPage.form.saveAndContinueButton.click()

    const cyaPage = Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answers')
    cyaPage.installationRiskSection.shouldHaveItem(
      'Which level of MAPPA applies to the device wearer? (optional)',
      'MAPPA 1',
    )
    cyaPage.installationRiskSection.shouldHaveItem(
      'Which category of MAPPA applies to the device wearer? (optional)',
      'Category 1',
    )
  })
})
