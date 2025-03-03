import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import NoFixedAbodePage from '../../../pages/order/contact-information/no-fixed-abode'

const mockOrderId = uuidv4()
const apiPath = '/device-wearer/no-fixed-abode'
const expectedValidationErrorMessage = 'You must indicate whether the device wearer has a fixed abode'

context('Contact information', () => {
  context('No fixed abode', () => {
    context('Submitting invalid data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [{ field: 'noFixedAbode', error: expectedValidationErrorMessage }],
        })

        cy.signIn()
      })

      it('Should display validation error messages', () => {
        const page = Page.visit(NoFixedAbodePage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(NoFixedAbodePage)

        page.form.hasFixedAddressField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrorMessage)
      })
    })
  })
})
