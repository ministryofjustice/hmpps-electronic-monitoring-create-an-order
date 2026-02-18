import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import TertiaryAddressPage from '../../../pages/order/contact-information/tertiary-adddress'

const mockOrderId = uuidv4()
const apiPath = '/address'
const expectedValidationErrors = {
  addressLine1: 'Enter address line 1, typically the building and street',
  addressLine3: 'Enter town or city',
  postcode: 'Enter postcode',
}

context('Contact information', () => {
  context('Tertiary address', () => {
    context('Submitting invalid data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should display frontend validation error messages', () => {
        const page = Page.visit(TertiaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'tertiary',
        })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(TertiaryAddressPage)

        page.form.addressLine1Field.shouldHaveValidationMessage(expectedValidationErrors.addressLine1)
        page.form.addressLine3Field.shouldHaveValidationMessage(expectedValidationErrors.addressLine3)
        page.form.postcodeField.shouldHaveValidationMessage(expectedValidationErrors.postcode)

        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrors.addressLine1)
        page.errorSummary.shouldHaveError(expectedValidationErrors.addressLine3)
        page.errorSummary.shouldHaveError(expectedValidationErrors.postcode)
      })

      it('Show validation errors from API response if frontend validation passes', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [{ field: 'postcode', error: 'Backend postcode validation error' }],
        })
        const page = Page.visit(TertiaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'tertiary',
        })
        const validFormData = {
          addressLine1: '1 Buckingham Palace',
          addressLine3: 'London',
          postcode: 'SW1A 1AA',
        }
        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(TertiaryAddressPage)
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Backend postcode validation error')
        page.form.postcodeField.shouldHaveValidationMessage('Backend postcode validation error')
      })
    })
  })
})
