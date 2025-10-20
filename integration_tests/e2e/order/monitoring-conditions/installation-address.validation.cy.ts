import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationAddressPage from '../../../pages/order/monitoring-conditions/installation-address'

const mockOrderId = uuidv4()
const apiPath = '/address'

const expectedValidationErrors = {
  addressLine1: 'Enter address line 1, typically the building and street',
  addressLine3: 'Enter town or city',
  postcode: 'Enter postcode',
}

context('Monitoring conditions', () => {
  context('Installation address', () => {
    context('Submitting invalid data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should display validation error messages for blank submission', () => {
        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
        })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(InstallationAddressPage)
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrors.addressLine1)
        page.errorSummary.shouldHaveError(expectedValidationErrors.addressLine3)
        page.errorSummary.shouldHaveError(expectedValidationErrors.postcode)

        page.form.addressLine1Field.shouldHaveValidationMessage(expectedValidationErrors.addressLine1)
        page.form.addressLine3Field.shouldHaveValidationMessage(expectedValidationErrors.addressLine3)
        page.form.postcodeField.shouldHaveValidationMessage(expectedValidationErrors.postcode)
      })

      it('Shows validation errors from. API response if frontend validaton passes', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [{ field: 'postcode', error: 'Backend postcode validation error' }],
        })

        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
        })

        const validFormData = {
          addressLine1: '1 Buckingham Palace',
          addressLine3: 'London',
          postcode: 'SW1A 1AA',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(InstallationAddressPage)
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Backend postcode validation error')
        page.form.postcodeField.shouldHaveValidationMessage('Backend postcode validation error')
      })
    })
  })
})
