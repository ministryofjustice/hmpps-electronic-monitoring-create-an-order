import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, createFakeAddress } from '../../../mockApis/faker'
import OrderTypePage from '../../../e2e/order/monitoring-conditions/order-type-description/order-type/OrderTypePage'
import SentenceTypePage from '../../../e2e/order/monitoring-conditions/order-type-description/sentence-type/SentenceTypePage'
import HdcPage from '../../../e2e/order/monitoring-conditions/order-type-description/hdc/hdcPage'
import PilotPage from '../../../e2e/order/monitoring-conditions/order-type-description/pilot/PilotPage'
import PrarrPage from '../../../e2e/order/monitoring-conditions/order-type-description/prarr/PrarrPage'

context('Order type descriptions', () => {
  let orderId: string
  const currenDate = new Date()
  const cacheOrderId = () => {
    cy.url().then((url: string) => {
      const parts = url.replace(Cypress.config().baseUrl, '').split('/')
      ;[, , orderId] = parts
    })
  }

  const deviceWearerDetails = {
    ...createFakeAdultDeviceWearer(),
    interpreterRequired: false,
    language: '',
    hasFixedAddress: 'Yes',
  }

  const primaryAddressDetails = {
    ...createFakeAddress(),
    hasAnotherAddress: 'No',
  }

  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER'],
    })
  })

  it('Notification org is prison, full HDC and pilot flow', () => {
    const interestedParties = createFakeInterestedParties('Prison', 'Home Office', null, null)
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.newOrderFormButton.click()

    const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    cacheOrderId()
    orderSummaryPage.aboutTheDeviceWearerTask.click()

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
    })
    const orderTypeDetails = {
      sentenceType: 'Standard Determinate Sentence',
      hdc: 'Yes',
      pilot: 'GPS acquisitive crime',
      typeOfAcquistiveCrime: 'Aggravated Burglary',
      policeForceArea: 'Kent',
      prarr: 'Yes',
      monitoringStartDate: new Date(currenDate.getFullYear(), 0, 1, 11, 11),
      monitoringEndDate: new Date(currenDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }
    cy.wrap(orderId).then(() => {
      // Monitoring condtion order type descriptions
      Page.visit(OrderTypePage, { orderId })

      // sentence type page
      const sentenceTypePage = Page.verifyOnPage(SentenceTypePage)
      sentenceTypePage.form.fillInWith(orderTypeDetails.sentenceType)
      sentenceTypePage.form.continueButton.click()

      // HDC page
      const hdcPage = Page.verifyOnPage(HdcPage)
      hdcPage.form.fillInWith(orderTypeDetails.hdc)
      hdcPage.form.continueButton.click()

      // Pilot page
      const pilotPage = Page.verifyOnPage(PilotPage)
      pilotPage.form.fillInWith(orderTypeDetails.pilot)
      pilotPage.form.continueButton.click()

      // Type of Acquistive Crime

      // Police force area

      // PARAA

      const prarrPage = Page.verifyOnPage(PrarrPage)
      prarrPage.form.fillInWith(orderTypeDetails.prarr)
      pilotPage.form.continueButton.click()

      // Monitoring Dates

      // Monitoring conditions
    })
  })
})
