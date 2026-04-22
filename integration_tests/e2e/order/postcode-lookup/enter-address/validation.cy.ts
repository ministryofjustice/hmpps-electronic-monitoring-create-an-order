import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import EnterAddressPage from './enterAddressPage'

const expectedValidationErrors = {
  addressLine1: 'Enter address line 1, typically the building and street',
  addressLine3: 'Enter town or city',
  postcode: 'Enter postcode',
}

context('Enter address page', () => {
  const mockOrderId = uuidv4()

  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
    })

    cy.signIn()
  })

  it('Should display frontend validation error messages', () => {
    const page = Page.visit(EnterAddressPage, {
      orderId: mockOrderId,
      addressType: 'PRIMARY',
    })

    page.form.saveAndContinueButton.click()

    Page.verifyOnPage(EnterAddressPage)

    page.form.addressLine1Field.shouldHaveValidationMessage(expectedValidationErrors.addressLine1)
    page.form.addressLine3Field.shouldHaveValidationMessage(expectedValidationErrors.addressLine3)
    page.form.postcodeField.shouldHaveValidationMessage(expectedValidationErrors.postcode)
    page.errorSummary.shouldExist()
    page.errorSummary.shouldHaveError(expectedValidationErrors.addressLine1)
    page.errorSummary.shouldHaveError(expectedValidationErrors.addressLine3)
    page.errorSummary.shouldHaveError(expectedValidationErrors.postcode)
  })
})
