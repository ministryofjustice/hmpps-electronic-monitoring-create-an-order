import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import HavePhotoPage from '../../../pages/order/attachments/havePhoto'

const mockOrderId = uuidv4()
const apiPath = '/attachments/file-required'

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
          response: [{ field: 'fileRequired', error: expectedValidationErrorMessage }],
        })
      })

      it('Should show errors no answer selected', () => {
        const page = Page.visit(HavePhotoPage, { orderId: mockOrderId })

        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        page.form.saveAndContinueButton.click()

        page.errorSummary.shouldExist()
        page.form.havePhotoField.validationMessage.contains('Select Yes if you have a document to upload')
      })

      it('Should display validation error messages', () => {
        const page = Page.visit(HavePhotoPage, { orderId: mockOrderId })
        page.form.havePhotoField.set('Yes')
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(HavePhotoPage)

        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrorMessage)
        page.form.havePhotoField.shouldHaveValidationMessage(expectedValidationErrorMessage)
      })
    })
  })
})
