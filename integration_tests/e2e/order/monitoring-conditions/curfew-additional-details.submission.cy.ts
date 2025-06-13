import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import CurfewAdditionalDetailsPage from '../../../pages/order/monitoring-conditions/curfew-additional-details'

const mockOrderId = uuidv4()

context('Monitoring conditions', () => {
  context('Curfew additional details', () => {
    context('Submitting a valid response with additional curfew information', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {},
        })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: '/monitoring-conditions-curfew-additional-details',
          response: {
            curfewAddress: null,
            orderId: mockOrderId,
            startDate: null,
            endDate: null,
          },
        })

        cy.signIn()
      })

      it('should submit when I check the no radio button', () => {
        const page = Page.visit(CurfewAdditionalDetailsPage, {
          orderId: mockOrderId,
        })

        page.form.curfewRadios.element.getByLabel('No').check()

        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}/monitoring-conditions-curfew-additional-details`,
          body: {
            curfewAdditionalDetails: '',
          },
        }).should('be.true')
      })

      it('should submit when I check yes and fill in the text box', () => {
        const page = Page.visit(CurfewAdditionalDetailsPage, {
          orderId: mockOrderId,
        })

        page.form.curfewRadios.element.getByLabel('Yes').check()
        cy.get('#additional-details').type('some curfew additional details')

        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}/monitoring-conditions-curfew-additional-details`,
          body: {
            curfewAdditionalDetails: 'some curfew additional details',
          },
        }).should('be.true')
      })
    })
    describe('submitting an invalid form', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {},
        })

        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: '/monitoring-conditions-curfew-additional-details',
          response: {
            curfewAddress: null,
            orderId: mockOrderId,
            startDate: null,
            endDate: null,
          },
        })

        cy.signIn()
      })

      it('should error when no radio buttons are selected', () => {
        const page = Page.visit(CurfewAdditionalDetailsPage, {
          orderId: mockOrderId,
        })

        page.form.saveAndContinueButton.click()

        cy.get('#details-error').should('contain', 'Enter detail of the curfew address boundary')
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Enter detail of the curfew address boundary')
      })

      it('should error when I select yes but submit an empty textarea', () => {
        const page = Page.visit(CurfewAdditionalDetailsPage, {
          orderId: mockOrderId,
        })

        page.form.curfewRadios.element.getByLabel('Yes').check()
        page.form.saveAndContinueButton.click()

        cy.get('#additional-details-error').should('contain', 'Enter detail of the curfew address boundary')
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Enter detail of the curfew address boundary')
      })
    })
  })
})
