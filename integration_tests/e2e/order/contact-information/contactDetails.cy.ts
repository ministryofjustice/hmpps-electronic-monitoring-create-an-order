import { v4 as uuidv4 } from 'uuid'
import { NotFoundErrorPage } from '../../../pages/error'
import Page from '../../../pages/page'
import ContactDetailsPage from '../../../pages/order/contact-information/contactDetails'
import AddressInformationPage from '../../../pages/order/contact-information/addressInformation'
import OrderSummaryPage from '../../../pages/order/summary'

const mockOrderId = uuidv4()

context('About the device wearer', () => {
  context('Draft order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    it('Should display the user name visible in header', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })
      page.header.userName().should('contain.text', 'J. Smith')
    })

    it('Should display the phase banner in header', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })
      page.header.phaseBanner().should('contain.text', 'dev')
    })

    it('Should render the save and continue/return buttons', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })

      // page.form.hasAction(`/order/${mockOrderId}/contact-details`)
      page.form.saveAndContinueButton.should('exist')
      page.form.saveAndReturnButton.should('exist')
      page.backToSummaryButton.should('not.exist')
    })

    // TODO: FAIL there is one form input related issues
    it.skip('Should be accessible', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })
  })

  context('Submitting a valid order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/contact-details',
        response: {
          contactNumber: 'abc',
        },
      })

      cy.signIn()
    })

    // TODO: FAIL page has not been created yet
    it('should continue to collect the address details', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })

      const validFormData = {
        contactNumber: 'abc',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}/contact-details`,
        body: {
          contactNumber: 'abc',
        },
      })

      Page.verifyOnPage(AddressInformationPage)
    })

    it('should return to the summary page', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })

      const validFormData = {
        contactNumber: 'abc',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndReturnButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}/contact-details`,
        body: {
          contactNumber: 'abc',
        },
      })

      Page.verifyOnPage(OrderSummaryPage)
    })
  })

  context('Submitting an invalid order', () => {
    const expectedValidationErrorMessage = 'Test validation message'

    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    context('with invalid contact number', () => {
      beforeEach(() => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: '/contact-details',
          response: [{ field: 'contactNumber', error: expectedValidationErrorMessage }],
        })
      })

      it('Should display validation error messages', () => {
        const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()
        page.form.contactNumberField.shouldHaveValidationMessage(expectedValidationErrorMessage)

        Page.verifyOnPage(ContactDetailsPage)
      })
    })
  })

  context('Submitted Order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'SUBMITTED' })

      cy.signIn()
    })

    it('Should not allow the user to update the contact details', () => {
      const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })

      // Verify the correct buttons are displayed
      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAndReturnButton.should('not.exist')
      page.backToSummaryButton.should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)

      // Verify all form elements are disabled
      page.form.contactNumberField.shouldBeDisabled()
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}/contact-information/contact-details`, { failOnStatusCode: false })

      Page.verifyOnPage(NotFoundErrorPage)
    })
  })
})
