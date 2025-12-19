import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer, createFakeInterestedParties } from '../../../mockApis/faker'
import OffencePage from '../../../e2e/order/access-needs-installation-risk/offences/offence/offencePage'
import OffenceOtherInfoPage from '../../../e2e/order/access-needs-installation-risk/offences/offence-other-info/offenceOtherInfoPage'

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

  beforeEach(() => {
    cy.task('setFeatureFlags', testFlags)
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER'],
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

  it('Notifying organization is Prsion, single offence flow', () => {
    const interestedParties = createFakeInterestedParties('Prison', 'Home Office', 'Altcourse Prison', null)
    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
    })

    // Should go to offence page
    const offencePage = Page.verifyOnPage(OffencePage)
    offencePage.form.continueButton.click()
    // Should go to offence other inromation page
    const offenceOtherInfoPage = Page.verifyOnPage(OffenceOtherInfoPage)
    offenceOtherInfoPage.form.continueButton.click()
    // Should go to details for installation page

    // CYA page
  })

  it('Notifying organization is civil court, multiple offences flow', () => {
    const interestedParties = createFakeInterestedParties('Civil & County Court', 'Home Office', null, null)
    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
    })

    // Should go to offence page
    const offencePage = Page.verifyOnPage(OffencePage)
    offencePage.form.continueButton.click()
    // Should go to offence add to list page

    // Should go to offence page

    // Should go to offence add to list page

    // Should go to offence other inromation page

    // Should go to details for installation page

    // CYA page
  })

  it.skip('Notifying organization is family court, multiple offences flow', () => {
    const interestedParties = createFakeInterestedParties('Family Court', 'Home Office', 'Altcourse Prison', null)
    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
    })

    // Should go to dapo and date page

    // Should go to offence add to list page

    // Should go to dapo and date page

    // Should go to details for installation page

    // CYA page
  })
})
