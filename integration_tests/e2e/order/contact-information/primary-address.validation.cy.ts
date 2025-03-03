import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import PrimaryAddressPage from '../../../pages/order/contact-information/primary-address'

const mockOrderId = uuidv4()
const apiPath = '/address'
const addressLine1Error = 'Address line 1 is required'
const addressLine2Error = 'Address line 2 is required'
const postcodeError = 'Postcode is required'

context('Contact information', () => {
  context('Primary address', () => {
    context('Submitting invalid data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [
            { field: 'addressLine1', error: addressLine1Error },
            { field: 'addressLine2', error: addressLine2Error },
            { field: 'postcode', error: postcodeError },
          ],
        })

        cy.signIn()
      })

      it('Should display validation error messages', () => {
        const page = Page.visit(PrimaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'primary',
        })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(PrimaryAddressPage)

        page.form.addressLine1Field.shouldHaveValidationMessage(addressLine1Error)
        page.form.addressLine2Field.shouldHaveValidationMessage(addressLine2Error)
        page.form.postcodeField.shouldHaveValidationMessage(postcodeError)
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(addressLine1Error)
        page.errorSummary.shouldHaveError(addressLine2Error)
        page.errorSummary.shouldHaveError(postcodeError)
      })
    })
  })
})
