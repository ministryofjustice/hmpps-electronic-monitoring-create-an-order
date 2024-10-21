import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import ContactDetailsPage from '../../../pages/order/contact-information/contact-details'
import OrderSummaryPage from '../../../pages/order/summary'
import NoFixedAbodePage from '../../../pages/order/contact-information/no-fixed-abode'

const mockOrderId = uuidv4()
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
        subPath: apiPath,
        response: {
          contactNumber: '01234567890',
        },
      })

      cy.signIn()
    })

    // TODO: FAIL page has not been created yet
    it('should submit a correctly formatted contact details submission', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })

      const validFormData = {
        contactNumber: '01234567890',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${apiPath}`,
        body: {
          contactNumber: '01234567890',
        },
      }).should('be.true')
    })

    it('should continue to collect no fixed abode details', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })

      const validFormData = {
        contactNumber: '01234567890',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()

      Page.verifyOnPage(NoFixedAbodePage)
    })

    it('should return to the summary page', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })

      const validFormData = {
        contactNumber: '01234567890',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndReturnButton.click()

      Page.verifyOnPage(OrderSummaryPage)
    })
  })
})
