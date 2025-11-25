import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer } from '../../../mockApis/faker'
import fillinAddress from '../../../utils/scenario-flows/postcode-lookup.cy'

context('Postcode Lookup', () => {
  let orderSummaryPage: OrderSummaryPage
  const testFlags = { POSTCODE_LOOKUP_ENABLED: true }

  const deviceWearerDetails = {
    ...createFakeAdultDeviceWearer(),
    interpreterRequired: false,
    language: '',
    hasFixedAddress: 'Yes',
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

  it('Should able to search for postcode and select address', () => {
    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
    })

    fillinAddress({ findAddress: 'Search' })
  })
})
