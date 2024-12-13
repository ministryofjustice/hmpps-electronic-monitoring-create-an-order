import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import VariationDetailsPage from '../../../pages/order/variation/variationDetails'

const mockOrderId = uuidv4()

const expectedValidationErrors = {
  variationType: {
    required: 'Variation type is required',
  },
  variationDate: {
    required: 'Variation date is required',
    malformed:
      'Date is in an incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.',
  },
}

context('Variation', () => {
  context('Variation Details', () => {
    context('Submitting invalid data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.signIn()
      })

      it('Should display validation error messages when the form has not been filled in', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(VariationDetailsPage)

        page.form.variationTypeField.shouldHaveValidationMessage(expectedValidationErrors.variationType.required)
        page.form.variationDateField.shouldHaveValidationMessage(expectedValidationErrors.variationDate.required)
      })

      it('Should display validation error messages when the form has not been filled in incorrectly', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId })

        page.form.fillInWith({
          variationType: 'Change of curfew hours',
          variationDate: new Date(2024, 1, 1),
        })
        page.form.variationDateField.setDay('q')
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(VariationDetailsPage)

        page.form.variationDateField.shouldHaveValidationMessage(expectedValidationErrors.variationDate.malformed)
      })
    })
  })
})
