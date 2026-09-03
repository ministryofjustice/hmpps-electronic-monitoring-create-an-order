import { v4 as uuidv4 } from 'uuid'
import CurfewDayOfReleasePage from '../../../../pages/order/monitoring-conditions/curfew-day-of-release'
import Page from '../../../../pages/page'

const mockOrderId = uuidv4()

context('Monitoring conditions - Curfew on day of release - validation', () => {
  const expectedValidationErrorMessage =
    "Select 'Yes' if you want to use the standard curfew times on the day of release"

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoListOrders')
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        interestedParties: { notifyingOrganisation: 'PRISON' },
      },
    })

    cy.signIn()
  })

  it('Should display a validation error when no option is selected', () => {
    let page = Page.visit(CurfewDayOfReleasePage, { orderId: mockOrderId })

    page.form.saveAndContinueButton.click()

    page = Page.verifyOnPage(CurfewDayOfReleasePage)

    page.form.standardCurfewTimesField.shouldHaveValidationMessage(expectedValidationErrorMessage)
    page.errorSummary.shouldExist()
    page.errorSummary.shouldHaveError(expectedValidationErrorMessage)
    page.form.standardCurfewTimesField.shouldNotHaveValue()
  })
})
