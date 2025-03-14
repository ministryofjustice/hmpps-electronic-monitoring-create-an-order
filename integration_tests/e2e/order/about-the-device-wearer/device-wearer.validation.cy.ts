import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import AboutDeviceWearerPage from '../../../pages/order/about-the-device-wearer/device-wearer'

const mockOrderId = uuidv4()
const expectedValidationErrors = {
  firstName: "Enter device wearer's first name",
  lastName: "Enter device wearer's last name",
  dob: 'Enter date of birth',
  is18: 'Select yes if a responsible adult is required',
  sex: "Select the device wearer's sex, or select 'Not able to provide this information'",
  gender: "Select the device wearer's gender, or select 'Not able to provide this information'",
  interpreter: 'Select yes if the device wearer requires an interpreter',
}

context('About the device wearer', () => {
  context('Device wearer', () => {
    context('Submitting an invalid order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should display validation error messages', () => {
        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(AboutDeviceWearerPage)

        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrors.firstName)
        page.errorSummary.shouldHaveError(expectedValidationErrors.lastName)
        page.errorSummary.shouldHaveError(expectedValidationErrors.dob)
        page.errorSummary.shouldHaveError(expectedValidationErrors.is18)
        page.errorSummary.shouldHaveError(expectedValidationErrors.sex)
        page.errorSummary.shouldHaveError(expectedValidationErrors.gender)
        page.errorSummary.shouldHaveError(expectedValidationErrors.interpreter)
        page.form.firstNamesField.shouldHaveValidationMessage(expectedValidationErrors.firstName)
        page.form.lastNameField.shouldHaveValidationMessage(expectedValidationErrors.lastName)
        page.form.dateOfBirthField.shouldHaveValidationMessage(expectedValidationErrors.dob)
        page.form.is18Field.shouldHaveValidationMessage(expectedValidationErrors.is18)
        page.form.sexField.shouldHaveValidationMessage(expectedValidationErrors.sex)
        page.form.genderIdentityField.shouldHaveValidationMessage(expectedValidationErrors.gender)
        page.form.interpreterRequiredField.shouldHaveValidationMessage(expectedValidationErrors.interpreter)
      })
    })
  })
})
