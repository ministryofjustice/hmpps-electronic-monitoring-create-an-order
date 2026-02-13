import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import CurfewAdditionalDetailsPage from '../../../pages/order/monitoring-conditions/curfew-additional-details'

const mockOrderId = uuidv4()

context('Monitoring conditions', () => {
  context('Curfew additional details', () => {
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

      it('should error when I select yes but curfew details is more than 500 characters', () => {
        const page = Page.visit(CurfewAdditionalDetailsPage, {
          orderId: mockOrderId,
        })

        page.form.fillInWith({
          curfewAdditionalDetails: 'a'.repeat(501),
        })
        page.form.saveAndContinueButton.click()

        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Detail of the curfew address boundary must be 500 characters or less')
        page.form.descriptionField.shouldHaveValidationMessage('You have 1 character too many')
        page.errorSummary.shouldExist()
        page.form.descriptionField.shouldHaveValidationMessage(
          'Detail of the curfew address boundary must be 500 characters or less',
        )
      })
    })
  })
})
