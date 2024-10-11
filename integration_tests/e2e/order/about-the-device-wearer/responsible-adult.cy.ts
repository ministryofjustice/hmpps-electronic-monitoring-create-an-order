import { v4 as uuidv4 } from 'uuid'
import { NotFoundErrorPage } from '../../../pages/error'
import Page from '../../../pages/page'
import ResponsibleAdultPage from '../../../pages/order/about-the-device-wearer/responsible-adult-details'
import ContactDetailsPage from '../../../pages/order/contact-information/contactDetails'

const mockOrderId = uuidv4()

context('About the device wearer - Responsible Adult', () => {
  context('Draft order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    it('Should display the user name visible in header', () => {
      const page = Page.visit(ResponsibleAdultPage, { orderId: mockOrderId })
      page.header.userName().should('contain.text', 'J. Smith')
    })

    it('Should display the phase banner in header', () => {
      const page = Page.visit(ResponsibleAdultPage, { orderId: mockOrderId })
      page.header.phaseBanner().should('contain.text', 'dev')
    })

    it('Should render the save and continue/return buttons', () => {
      const page = Page.visit(ResponsibleAdultPage, { orderId: mockOrderId })
      page.form.hasAction(`/order/${mockOrderId}/about-the-device-wearer/responsible-adult`)
      page.form.saveAndContinueButton().should('exist')
      page.form.saveAndReturnButton().should('exist')
      page.backToSummaryButton().should('not.exist')
    })

    it.skip('Should be accessible', () => {
      const page = Page.visit(ResponsibleAdultPage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })
  })

  context('Submitting a valid order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoPutResponsibleAdult', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    it('should continue to collect the responsible officer details', () => {
      const page = Page.visit(ResponsibleAdultPage, { orderId: mockOrderId })

      const validFormData = {
        relationship: 'Other',
        otherRelationshipDetails: 'Partner',
        fullName: 'Audrey Taylor',
        contactNumber: '07101 123 456',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton().click()

      Page.verifyOnPage(ContactDetailsPage)
    })
  })

  context('Submitting an invalid order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    context('Not entering any information', () => {
      it.skip('should not continue to collect the responsible officer details', () => {
        cy.task('stubCemoPutResponsibleAdult', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
        })

        const page = Page.visit(ResponsibleAdultPage, { orderId: mockOrderId })

        page.form.saveAndContinueButton().click()

        Page.verifyOnPage(ResponsibleAdultPage)
        // TODO: and there should be some validation message showing
      })
    })

    context('Only entering relationship', () => {
      it.skip('should not continue to collect the responsible officer details', () => {
        cy.task('stubCemoPutResponsibleAdult', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          relationship: 'Other',
        })

        const page = Page.visit(ResponsibleAdultPage, { orderId: mockOrderId })

        page.form.setRelationship('Other')
        page.form.saveAndContinueButton().click()

        Page.verifyOnPage(ResponsibleAdultPage)
        // TODO: and there should be some validation message showing
      })
    })

    context('Only entering full name', () => {
      it.skip('should not continue to collect the responsible officer details', () => {
        cy.task('stubCemoPutResponsibleAdult', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          fullName: 'Martha Steward',
        })

        const page = Page.visit(ResponsibleAdultPage, { orderId: mockOrderId })

        page.form.setFullName('Martha Steward')
        page.form.saveAndContinueButton().click()

        Page.verifyOnPage(ResponsibleAdultPage)
        // TODO: and there should be some validation message showing
      })
    })

    context('Only entering contact number', () => {
      it.skip('should not continue to collect the responsible officer details', () => {
        cy.task('stubCemoPutResponsibleAdult', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          contactNumber: '999999',
        })

        const page = Page.visit(ResponsibleAdultPage, { orderId: mockOrderId })

        page.form.setContactNumber('999999')
        page.form.saveAndContinueButton().click()

        Page.verifyOnPage(ResponsibleAdultPage)
        // TODO: and there should be some validation message showing
      })
    })
  })

  context('Submitted order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'SUBMITTED' })

      cy.signIn()
    })

    it('Should display the back to summary button', () => {
      const page = Page.visit(ResponsibleAdultPage, { orderId: mockOrderId })

      page.form.saveAndContinueButton().should('not.exist')
      page.form.saveAndReturnButton().should('not.exist')
      page.backToSummaryButton().should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}/about-the-device-wearer/responsible-adult`, { failOnStatusCode: false })

      Page.verifyOnPage(NotFoundErrorPage)
    })
  })
})
