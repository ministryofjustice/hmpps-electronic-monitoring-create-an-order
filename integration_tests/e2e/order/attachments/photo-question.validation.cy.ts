import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import PhotoQuestionPage from '../../../pages/order/attachments/photoQuestion'

const mockOrderId = uuidv4()
const apiPath = '/attachments/have-photo'

context('Attachments - have photo', () => {
  context('Submitting an invalid request', () => {
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
          response: [{ field: 'havePhoto', error: expectedValidationErrorMessage }],
        })
      })

      it('Should display validation error messages', () => {
        const page = Page.visit(PhotoQuestionPage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(PhotoQuestionPage)

        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrorMessage)
        page.form.photoQuestionField.shouldHaveValidationMessage(expectedValidationErrorMessage)
      })
    })
  })
})
