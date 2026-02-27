import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import ContactDetailsPage from '../../../pages/order/contact-information/contact-details'

const mockOrderId = uuidv4()
const apiPath = '/contact-details'

context('Contact details - Contact information', () => {
  context('Submitting an invalid order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    context('with no data entered', () => {
      beforeEach(() => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {},
        })
      })

      it('Should display validation error messages', () => {
        const expectedValidationErrorMessage = 'Select Yes if the device wearer has a contact telephone number'
        const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(ContactDetailsPage)

        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrorMessage)
        page.form.contactNumberAvailableField.shouldHaveValidationMessage(expectedValidationErrorMessage)
      })

      it('Should display validation error messages when selected yes to contact number available but not enter phone number', () => {
        const expectedValidationErrorMessage = 'Enter the device wearer’s telephone number'
        const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })
        page.form.contactNumberAvailableField.set('Yes')
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(ContactDetailsPage)

        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrorMessage)
        page.form.contactNumberField.shouldHaveValidationMessage(expectedValidationErrorMessage)
      })
    })
  })
})
