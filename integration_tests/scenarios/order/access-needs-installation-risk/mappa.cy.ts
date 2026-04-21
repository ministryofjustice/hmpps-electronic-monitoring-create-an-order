import DetailsOfInstallationPage from '../../../e2e/order/access-needs-installation-risk/details-of-installation/DetailsOfInstallationPage'
import IsMappaPage from '../../../e2e/order/access-needs-installation-risk/is-mappa/IsMappaPage'
import MappaPage from '../../../e2e/order/access-needs-installation-risk/mappa/MappaPage'
import { createFakeAdultDeviceWearer, createFakeInterestedParties } from '../../../mockApis/faker'
import IndexPage from '../../../pages'
import InstallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'
import OrderSummaryPage from '../../../pages/order/summary'
import Page from '../../../pages/page'

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

  const detailsOfInstallationInfo = {
    possibleRisks: ['Violent behaviour or threats of violence'],
    riskCategories: ['Safeguarding child'],
    riskDetails: 'some details',
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

    const detailsOfInstallationPage = Page.verifyOnPage(DetailsOfInstallationPage)
    detailsOfInstallationPage.form.fillInWith(detailsOfInstallationInfo)
    detailsOfInstallationPage.form.saveAndContinueButton.click()

    const isMappaPage = Page.verifyOnPage(IsMappaPage)
    isMappaPage.form.fillInWith({ isMappa: 'Yes' })
    isMappaPage.form.saveAndContinueButton.click()

    const mappaPage = Page.verifyOnPage(MappaPage)
    mappaPage.form.fillInWith({ level: 'MAPPA 1', category: 'Category 1' })
    mappaPage.form.saveAndContinueButton.click()

    const cyaPage = Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answers')
    cyaPage.installationRiskSection.shouldNotHaveItem('What type of offence did the device wearer commit?')
    cyaPage.installationRiskSection.shouldNotHaveItem(
      'Any other information to be aware of about the offence committed?',
    )
    cyaPage.installationRiskSection.shouldNotHaveItem('Offences')
    cyaPage.installationRiskSection.shouldHaveItem(
      'Is the device wearer a Multi-Agency Public Protection Arrangements (MAPPA) offender?',
      'Yes',
    )
    cyaPage.installationRiskSection.shouldHaveItem('Which level of MAPPA applies to the device wearer?', 'MAPPA 1')
    cyaPage.installationRiskSection.shouldHaveItem(
      'Which category of MAPPA applies to the device wearer?',
      'Category 1',
    )
  })

  it('Notifying organisation is Home Office, not mappa flow', () => {
    const interestedParties = createFakeInterestedParties('Home Office', 'Home Office')
    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
    })

    const detailsOfInstallationPage = Page.verifyOnPage(DetailsOfInstallationPage)
    detailsOfInstallationPage.form.fillInWith(detailsOfInstallationInfo)
    detailsOfInstallationPage.form.saveAndContinueButton.click()

    const isMappaPage = Page.verifyOnPage(IsMappaPage)
    isMappaPage.form.fillInWith({ isMappa: 'No' })
    isMappaPage.form.saveAndContinueButton.click()

    const cyaPage = Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answers')
    cyaPage.installationRiskSection.shouldNotHaveItem('What type of offence did the device wearer commit?')
    cyaPage.installationRiskSection.shouldNotHaveItem(
      'Any other information to be aware of about the offence committed?',
    )
    cyaPage.installationRiskSection.shouldNotHaveItem('Offences')
    cyaPage.installationRiskSection.shouldHaveItem(
      'Is the device wearer a Multi-Agency Public Protection Arrangements (MAPPA) offender?',
      'No',
    )
  })
})
