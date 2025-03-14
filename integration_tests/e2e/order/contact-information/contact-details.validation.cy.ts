import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import ContactDetailsPage from '../../../pages/order/contact-information/contact-details'

const mockOrderId = uuidv4()
const apiPath = '/contact-details'

context('Contact details - Contact information', () => {
  context('Submitting an invalid order', () => {
    const expectedValidationErrorMessage = 'Test validation message'

    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    context('with no data entered', () => {
      beforeEach(() => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [{ field: 'contactNumber', error: expectedValidationErrorMessage }],
        })
      })

      it('Should display validation error messages', () => {
        const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(ContactDetailsPage)

        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrorMessage)
        page.form.contactNumberField.shouldHaveValidationMessage(expectedValidationErrorMessage)
      })
    })
  })
})
