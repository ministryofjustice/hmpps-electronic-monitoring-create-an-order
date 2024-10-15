import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import ContactDetailsPage from '../../../pages/order/contact-information/contact-details'
import AddressInformationPage from '../../../pages/order/contact-information/addressInformation'
import OrderSummaryPage from '../../../pages/order/summary'

const mockOrderId = uuidv4()
const pagePath = '/contact-information/contact-details'
const apiPath = '/contact-details'

context('Contact details - Contact information', () => {
  context('Submitting valid contact details', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: pagePath,
        response: {
          contactNumber: 'abc',
        },
      })

      cy.signIn()
    })

    // TODO: FAIL page has not been created yet
    it('should submit a correctly formatted contact details submission', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })

      const validFormData = {
        contactNumber: 'abc',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${apiPath}`,
        body: {
          contactNumber: 'abc',
        },
      }).should('be.true')
    })

    // TODO: FAIL page has not been created yet
    it.skip('should continue to the address details', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })

      const validFormData = {
        contactNumber: 'abc',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()

      Page.verifyOnPage(AddressInformationPage)
    })

    // TODO: FAIL page has not been created yet
    it.skip('should return to the summary page', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })

      const validFormData = {
        contactNumber: 'abc',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndReturnButton.click()

      Page.verifyOnPage(OrderSummaryPage)
    })
  })
})
