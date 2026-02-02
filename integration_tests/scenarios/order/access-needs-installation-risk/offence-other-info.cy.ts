import OrderSummaryPage from '../../../pages/order/summary'
import OffenceOtherInfoPage from '../../../e2e/order/access-needs-installation-risk/offences/offence-other-info/offenceOtherInfoPage'
import OffencePage from '../../../e2e/order/access-needs-installation-risk/offences/offence/offencePage'
import { createFakeAdultDeviceWearer, createFakeInterestedParties } from '../../../mockApis/faker'
import IndexPage from '../../../pages'
import InstallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'
import InstallationAndRiskPage from '../../../pages/order/installationAndRisk'
import Page from '../../../pages/page'

context('offence other info', () => {
  let orderSummaryPage: OrderSummaryPage
  const testFlags = { OFFENCE_FLOW_ENABLED: true }

  const deviceWearerDetails = {
    ...createFakeAdultDeviceWearer(),
    disabilities: 'Not able to provide this information',
    interpreterRequired: false,
    language: '',
    hasFixedAddress: 'No',
  }

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

  it('displays offence other information', () => {
    const interestedParties = createFakeInterestedParties('Prison', 'Home Office', 'Altcourse Prison', null)
    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
    })

    const offencePage = Page.verifyOnPage(OffencePage)
    offencePage.form.fillInWith({ offenceType: 'Criminal damage and arson' })
    offencePage.form.saveAndContinueButton.click()

    const offenceOtherInfoPage = Page.verifyOnPage(OffenceOtherInfoPage)
    offenceOtherInfoPage.form.fillInWith({
      hasOtherInformation: 'Yes',
      otherInformationDetails: 'offender has a history of aggressive behaviour',
    })
    offenceOtherInfoPage.form.saveAndContinueButton.click()

    const installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
    installationAndRiskPage.form.fillInWith(installationAndRisk)
    installationAndRiskPage.form.saveAndContinueButton.click()

    const cyaPage = Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answer')

    cyaPage.installationRiskSection.shouldHaveItem(
      'Any other information to be aware of about the offence committed?',
      'offender has a history of aggressive behaviour',
    )
  })

  it('no offence other information', () => {
    const interestedParties = createFakeInterestedParties('Prison', 'Home Office', 'Altcourse Prison', null)
    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
    })

    const offencePage = Page.verifyOnPage(OffencePage)
    offencePage.form.fillInWith({ offenceType: 'Criminal damage and arson' })
    offencePage.form.saveAndContinueButton.click()

    const offenceOtherInfoPage = Page.verifyOnPage(OffenceOtherInfoPage)
    offenceOtherInfoPage.form.fillInWith({
      hasOtherInformation: 'No',
    })
    offenceOtherInfoPage.form.saveAndContinueButton.click()

    const installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
    installationAndRiskPage.form.fillInWith(installationAndRisk)
    installationAndRiskPage.form.saveAndContinueButton.click()

    const cyaPage = Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answer')

    cyaPage.installationRiskSection.shouldHaveItem(
      'Any other information to be aware of about the offence committed?',
      '',
    )
  })
})
