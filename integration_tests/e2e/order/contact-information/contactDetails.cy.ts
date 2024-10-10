import { v4 as uuidv4 } from 'uuid'
import ErrorPage from '../../../pages/error'
import ContactDetailsPage from '../../../pages/order/contact-information/contactDetails'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import AddressInformationPage from '../../../pages/order/contact-information/addressInformation'
import OrderSummaryPage from '../../../pages/order/summary'
import Page from '../../../pages/page'

const mockOrderId = uuidv4()

context('About the device wearer', () => {
  context('Draft order', () => {
    context('Successful submission', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoPutContactDetails', { httpStatus: 200, id: mockOrderId, erorrs: [] })
      })

      it('Should allow the user to submit data and move to the next page', () => {
        cy.signIn().visit(`/order/${mockOrderId}/contact-information/contact-details`)
        const page = Page.verifyOnPage(ContactDetailsPage)

        page.contactNumber().type('abc')
        page.saveAndContinueButton().click()

        // Doesn't actually exist yet
        // Page.verifyOnPage(AddressInformationPage)
      })

      it('Should allow the user to submit data and move to the summary page', () => {
        cy.signIn().visit(`/order/${mockOrderId}/contact-information/contact-details`)
        const page = Page.verifyOnPage(ContactDetailsPage)

        page.contactNumber().type('abc')
        page.saveAndReturnButton().click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })

    context('Bad submission', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoPutContactDetails', {
          httpStatus: 400,
          id: mockOrderId,
          errors: [{ error: 'Phone number is in an incorrect format', field: 'contactNumber' }],
        })
      })

      it('Should not allow the user to submit invalid data and should display error messages', () => {
        cy.signIn().visit(`/order/${mockOrderId}/contact-information/contact-details`)
        const page = Page.verifyOnPage(ContactDetailsPage)

        page.contactNumber().type('abc')
        page.saveAndContinueButton().click()

        Page.verifyOnPage(ContactDetailsPage)
        page
          .contactNumber()
          .siblings('.govuk-error-message')
          .should('contain', 'Phone number is in an incorrect format')
      })
    })
  })

  context('Submitted Order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'SUBMITTED' })
    })

    it('Should not allow the user to update the contact details', () => {
      cy.signIn().visit(`/order/${mockOrderId}/contact-information/contact-details`)
      const page = Page.verifyOnPage(ContactDetailsPage)

      // Verify sub heading is correct
      page.subHeading().should('contain', 'Contact details')

      // Verify the correct buttons are displayed
      page.saveAndContinueButton().should('not.exist')
      page.saveAndReturnButton().should('not.exist')
      page.backToSummaryButton().should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)

      // Verify all form elements are disabled
      page.inputs().should('be.disabled')
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}/contact-information/contact-details`, { failOnStatusCode: false })

      Page.verifyOnPage(ErrorPage, 'Not Found')
    })
  })
})
