import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import ResponsibleOfficerPage from './responsibleOfficerPage'

context('Responsible officer page', () => {
  const mockOrderId = uuidv4()
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        dataDictionaryVersion: 'DDV6',
      },
    })

    cy.signIn()
  })

  it('Should show errors when no data entered', () => {
    const page = Page.visit(ResponsibleOfficerPage, { orderId: mockOrderId })

    page.form.continueButton.click()
    page.errorSummary.shouldExist()
    page.errorSummary.verifyErrorSummary([
      "Enter the Responsible Officer's first name",
      "Enter the Responsible Officer's last name",
      "Enter the Responsible Officer's email address",
    ])

    page.form.firstNameField.shouldHaveValidationMessage("Enter the Responsible Officer's first name")
    page.form.lastNameField.shouldHaveValidationMessage("Enter the Responsible Officer's last name")
    page.form.emailField.shouldHaveValidationMessage("Enter the Responsible Officer's email address")
  })
})
