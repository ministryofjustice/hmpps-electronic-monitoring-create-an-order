import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer, createFakeInterestedParties } from '../../../mockApis/faker'
import OffencePage from '../../../e2e/order/access-needs-installation-risk/offences/offence/offencePage'
import OffenceOtherInfoPage from '../../../e2e/order/access-needs-installation-risk/offences/offence-other-info/offenceOtherInfoPage'
import InstallationAndRiskPage from '../../../pages/order/installationAndRisk'
import InstallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'
import OffenceListPage from '../../../e2e/order/access-needs-installation-risk/offences/offence-list/offenceListPage'
import DapoPage from '../../../e2e/order/access-needs-installation-risk/offences/dapo/dapoPage'
import OffenceListDeletePage from '../../../e2e/order/access-needs-installation-risk/offences/delete/offenceListDeletePage'

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

  it('Notifying organisation is Prison, single offence flow', () => {
    const interestedParties = createFakeInterestedParties('Prison', 'Home Office', 'Altcourse Prison', null)
    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
    })

    // Should go to offence page
    const offencePage = Page.verifyOnPage(OffencePage)
    offencePage.form.continueButton.click()
    // Should go to offence other information page
    const offenceOtherInfoPage = Page.verifyOnPage(OffenceOtherInfoPage)
    offenceOtherInfoPage.form.continueButton.click()
    // Should go to risk and installation page
    const installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
    installationAndRiskPage.form.fillInWith(installationAndRisk)
    installationAndRiskPage.form.saveAndContinueButton.click()
    // CYA page
    Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answer')
  })

  it('Notifying organisation is civil court, multiple offences flow', () => {
    const interestedParties = createFakeInterestedParties('Civil & County Court', 'Home Office', null, null)
    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
    })

    // Should go to offence page
    let offencePage = Page.verifyOnPage(OffencePage)
    offencePage.form.continueButton.click()
    // Should go to offence add to list page
    let offenceList = Page.verifyOnPage(OffenceListPage)
    offenceList.form.fillInWith('Add')
    offenceList.form.continueButton.click()
    // Should go to offence page
    offencePage = Page.verifyOnPage(OffencePage)
    offencePage.form.continueButton.click()
    // Should go to offence add to list page
    offenceList = Page.verifyOnPage(OffenceListPage)
    offenceList.form.fillInWith('Next')
    offenceList.form.continueButton.click()
    // Should go to offence other information page
    const offenceOtherInfoPage = Page.verifyOnPage(OffenceOtherInfoPage)
    offenceOtherInfoPage.form.continueButton.click()
    // Should go to risk and installation page
    const installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
    installationAndRiskPage.form.fillInWith(installationAndRisk)
    installationAndRiskPage.form.saveAndContinueButton.click()
    // CYA page
    Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answer')
  })

  it('Notifying organisation is family court, multiple dapo flow', () => {
    const interestedParties = createFakeInterestedParties('Family Court', 'Home Office', 'Altcourse Prison', null)
    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
    })

    // Should go to dapo and date page
    let dapoPage = Page.verifyOnPage(DapoPage)
    dapoPage.form.continueButton.click()
    // Should go to offence add to list page
    let offenceList = Page.verifyOnPage(OffenceListPage)
    offenceList.form.fillInWith('Add')
    offenceList.form.continueButton.click()
    // Should go to dapo and date page
    dapoPage = Page.verifyOnPage(DapoPage)
    dapoPage.form.continueButton.click()
    // Should go to offence add to list page
    offenceList = Page.verifyOnPage(OffenceListPage)
    offenceList.form.fillInWith('Next')
    offenceList.form.continueButton.click()
    // Should go to risk and installation page
    const installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
    installationAndRiskPage.form.fillInWith(installationAndRisk)
    installationAndRiskPage.form.saveAndContinueButton.click()
    // CYA page
    Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answer')
  })

  it('Should able to delete dapo', () => {
    const interestedParties = createFakeInterestedParties('Family Court', 'Home Office', 'Altcourse Prison', null)
    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
    })

    // Should go to dapo and date page
    let dapoPage = Page.verifyOnPage(DapoPage)
    dapoPage.form.continueButton.click()
    // Should go to offence add to list page
    let offenceList = Page.verifyOnPage(OffenceListPage)
    offenceList.form.fillInWith('Add')
    offenceList.form.continueButton.click()
    // Should go to dapo and date page
    dapoPage = Page.verifyOnPage(DapoPage)
    dapoPage.form.continueButton.click()
    // Should go to offence add to list page
    offenceList = Page.verifyOnPage(OffenceListPage)
    offenceList.form.fillInWith('Delete')
    offenceList.form.continueButton.click()
    // Should go to offence list delete page
    const offenceListDeletePage = Page.verifyOnPage(OffenceListDeletePage)
    offenceListDeletePage.form.continueButton.click()
    // Should go to offence add to list page
    Page.verifyOnPage(OffenceListPage)
  })
})
