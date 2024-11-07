import { v4 as uuidv4 } from 'uuid'
import CurfewTimetablePage from '../../../../pages/order/monitoring-conditions/curfew-timetable'
import Page from '../../../../pages/page'

const mockOrderId = uuidv4()
const apiPath = '/monitoring-conditions-curfew-timetable'

context('Monitoring conditions - Curfew timetable', () => {
  context('Submitting an invalid order', () => {
    const expectedValidationErrorMessage = 'Test validation message'

    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    context('with no data entered', () => {
      beforeEach(() => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [
            {
              index: 0,
              errors: [{ field: 'startTime', error: expectedValidationErrorMessage }],
            },
            {
              index: 2,
              errors: [
                { field: 'startTime', error: expectedValidationErrorMessage },
                { field: 'endTime', error: expectedValidationErrorMessage },
              ],
            },
            {
              index: 4,
              errors: [{ field: 'curfewAddress', error: expectedValidationErrorMessage }],
            },
          ],
        })
      })

      it('Should display validation error messages', () => {
        let page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        page = Page.verifyOnPage(CurfewTimetablePage)

        page.form.shouldHaveValidationMessage('Monday', expectedValidationErrorMessage)
        page.form.shouldHaveValidationMessage(
          'Wednesday',
          `${expectedValidationErrorMessage}, ${expectedValidationErrorMessage}`,
        )
        page.form.shouldHaveValidationMessage('Friday', expectedValidationErrorMessage)
      })
    })
  })
})
