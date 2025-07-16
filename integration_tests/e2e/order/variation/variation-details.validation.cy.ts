import { v4 as uuidv4 } from 'uuid'
import { fakerEN_GB as faker } from '@faker-js/faker'
import Page from '../../../pages/page'
import VariationDetailsPage from '../../../pages/order/variation/variationDetails'

const mockOrderId = uuidv4()

const expectedValidationErrors = {
  variationType: {
    required: 'Select what you have changed',
  },
  variationDate: {
    required: 'Enter the date you want the changes to take effect',
    mustBeRealDate: 'Variation date must be a real date',
    malformed:
      'Date is in an incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.',
  },
  variationDetails: {
    required: 'Enter information on what you have changed',
  },
}

context('Variation', () => {
  context('Variation Details', () => {
    context('Submitting invalid data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: { dataDictionaryVersion: 'DDV4' },
        })
        cy.signIn()
      })

      it('Should display validation error messages when the form has not been filled in', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId })

        page.form.saveAndReturnButton.click()

        Page.verifyOnPage(VariationDetailsPage)

        page.form.variationDateField.shouldHaveValidationMessage(expectedValidationErrors.variationDate.required)
        page.form.variationDetailsField.shouldHaveValidationMessage(expectedValidationErrors.variationDetails.required)
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrors.variationDate.required)
        page.errorSummary.shouldHaveError(expectedValidationErrors.variationDetails.required)
      })

      it('Should display date validation error message when the form date has not been filled in incorrectly', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId })

        page.form.fillInWith({
          variationDate: new Date(2024, 1, 1),
          variationDetails: 'Change to curfew hours',
        })
        page.form.variationDateField.setDay('q')
        page.form.saveAndReturnButton.click()

        Page.verifyOnPage(VariationDetailsPage)

        page.form.variationDateField.shouldHaveValidationMessage(expectedValidationErrors.variationDate.mustBeRealDate)
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrors.variationDate.mustBeRealDate)
      })

      it('Should display description validation error message when the form description has not been filled in', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId })

        page.form.fillInWith({
          variationDate: new Date(2024, 1, 1),
        })

        page.form.saveAndReturnButton.click()

        Page.verifyOnPage(VariationDetailsPage)

        page.form.variationDetailsField.shouldHaveValidationMessage(expectedValidationErrors.variationDetails.required)
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrors.variationDetails.required)
      })

      it('Should display description validation error message when the form description is longer than 200 characters', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId })

        page.form.fillInWith({
          variationDetails: faker.string.fromCharacters(
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            201,
          ),
          variationDate: new Date(2024, 1, 1),
        })
        page.form.variationDetailsField.shouldHaveValidationMessage('You have 1 character too many')
        page.form.saveAndReturnButton.click()

        Page.verifyOnPage(VariationDetailsPage)

        page.form.variationDetailsField.shouldHaveValidationMessage(
          'Information on what you have changed must be 200 characters or less',
        )
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Information on what you have changed must be 200 characters or less')
      })
    })
  })
})
