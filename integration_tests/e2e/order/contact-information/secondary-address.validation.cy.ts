import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import SecondaryAddressPage from '../../../pages/order/contact-information/secondary-address'

const mockOrderId = uuidv4()
const apiPath = '/address'
const addressLine1Error = 'Address line 1 is required'
const addressLine2Error = 'Address line 2 is required'
const postcodeError = 'Postcode is required'

context('Contact information', () => {
  context('Secondary address', () => {
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
        const page = Page.visit(SecondaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'secondary',
        })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(SecondaryAddressPage)

        page.form.addressLine1Field.shouldHaveValidationMessage(addressLine1Error)
        page.form.addressLine2Field.shouldHaveValidationMessage(addressLine2Error)
        page.form.postcodeField.shouldHaveValidationMessage(postcodeError)
      })
    })
  })
})
