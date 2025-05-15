import { v4 as uuidv4 } from 'uuid'
import { NotFoundErrorPage } from '../../../pages/error'
import Page from '../../../pages/page'
import ResponsibleAdultPage from '../../../pages/order/about-the-device-wearer/responsible-adult-details'
import IdentityNumbersPage from '../../../pages/order/about-the-device-wearer/identity-numbers'

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

      page.form.saveAndContinueButton.should('exist')
      page.form.saveAndReturnButton.should('exist')
      page.backToSummaryButton.should('exist')
      page.errorSummary.shouldNotExist()
    })

    // TODO: FAIL there are two form input related issues
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

    it('should continue to check your answers page', () => {
      const page = Page.visit(ResponsibleAdultPage, { orderId: mockOrderId })

      const validFormData = {
        relationship: 'Other',
        otherRelationshipDetails: 'Partner',
        fullName: 'Audrey Taylor',
        contactNumber: '07101 123 456',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}/device-wearer-responsible-adult`,
        body: {
          relationship: 'other',
          otherRelationshipDetails: 'Partner',
          fullName: 'Audrey Taylor',
          contactNumber: '07101 123 456',
        },
      }).should('be.true')

      Page.verifyOnPage(IdentityNumbersPage)
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
      it('should not continue to collect the responsible officer details', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: '/device-wearer-responsible-adult',
          response: [
            { field: 'relationship', error: 'Relationship is required' },
            { field: 'fullName', error: 'Full name is required' },
          ],
        })

        cy.visit(`/order/${mockOrderId}/about-the-device-wearer/responsible-adult`)
        const page = Page.verifyOnPage(ResponsibleAdultPage)
        // const page = Page.visit(ResponsibleAdultPage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        cy.task('getStubbedRequest', `/orders/${mockOrderId}/device-wearer-responsible-adult`).then(requests => {
          expect(requests).to.have.lengthOf(1)
          expect(requests[0]).to.deep.equal({
            fullName: '',
            contactNumber: null,
            relationship: '',
            otherRelationshipDetails: '',
          })
        })
        cy.get('#relationship-error').should('contain', 'Relationship is required')
        cy.get('#fullName-error').should('contain', 'Full name is required')
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Relationship is required')
        page.errorSummary.shouldHaveError('Full name is required')
      })
    })

    context('Only entering relationship', () => {
      it('should not continue to collect the responsible officer details', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: '/device-wearer-responsible-adult',
          response: [
            { field: 'fullName', error: 'Full name is required' },
            { field: 'contactNumber', error: 'Phone number is in an incorrect format' },
          ],
        })

        cy.visit(`/order/${mockOrderId}/about-the-device-wearer/responsible-adult`)
        const page = Page.verifyOnPage(ResponsibleAdultPage)

        page.form.relationshipField.set('Guardian')
        page.form.saveAndContinueButton.click()

        cy.task('getStubbedRequest', `/orders/${mockOrderId}/device-wearer-responsible-adult`).then(requests => {
          expect(requests).to.have.lengthOf(1)
          expect(requests[0]).to.deep.equal({
            fullName: '',
            contactNumber: null,
            relationship: 'guardian',
            otherRelationshipDetails: '',
          })
        })
        cy.get('#contactNumber-error').should('contain', 'Phone number is in an incorrect format')
        cy.get('#fullName-error').should('contain', 'Full name is required')
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Phone number is in an incorrect format')
        page.errorSummary.shouldHaveError('Full name is required')
      })
    })

    context('Only entering full name', () => {
      it('should not continue to collect the responsible officer details', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: '/device-wearer-responsible-adult',
          response: [
            { field: 'relationship', error: 'Relationship is required' },
            { field: 'contactNumber', error: 'Phone number is in an incorrect format' },
          ],
        })

        cy.visit(`/order/${mockOrderId}/about-the-device-wearer/responsible-adult`)
        const page = Page.verifyOnPage(ResponsibleAdultPage)

        page.form.fullNameField.set('Martha Steward')
        page.form.saveAndContinueButton.click()

        cy.task('getStubbedRequest', `/orders/${mockOrderId}/device-wearer-responsible-adult`).then(requests => {
          expect(requests).to.have.lengthOf(1)
          expect(requests[0]).to.deep.equal({
            fullName: 'Martha Steward',
            contactNumber: null,
            relationship: '',
            otherRelationshipDetails: '',
          })
        })
        cy.get('#relationship-error').should('contain', 'Relationship is required')
        cy.get('#contactNumber-error').should('contain', 'Phone number is in an incorrect format')
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Phone number is in an incorrect format')
        page.errorSummary.shouldHaveError('Relationship is required')
      })
    })

    context('Only entering contact number', () => {
      it('should not continue to collect the responsible officer details', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: '/device-wearer-responsible-adult',
          response: [
            { field: 'relationship', error: 'Relationship is required' },
            { field: 'fullName', error: 'Full name is required' },
          ],
        })

        cy.visit(`/order/${mockOrderId}/about-the-device-wearer/responsible-adult`)
        const page = Page.verifyOnPage(ResponsibleAdultPage)

        page.form.contactNumberField.set('999999')
        page.form.saveAndContinueButton.click()

        cy.task('getStubbedRequest', `/orders/${mockOrderId}/device-wearer-responsible-adult`).then(requests => {
          expect(requests).to.have.lengthOf(1)
          expect(requests[0]).to.deep.equal({
            fullName: '',
            contactNumber: '999999',
            relationship: '',
            otherRelationshipDetails: '',
          })
        })
        cy.get('#relationship-error').should('contain', 'Relationship is required')
        cy.get('#fullName-error').should('contain', 'Full name is required')
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Full name is required')
        page.errorSummary.shouldHaveError('Relationship is required')
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

      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAndReturnButton.should('not.exist')
      page.backToSummaryButton.should('exist').should('have.attr', 'href', '#')
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
