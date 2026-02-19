import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import NotifyingOrganisationPage from './notifyingOrganisationPage'

const mockOrderId = uuidv4()

context('Notifying Organisation validation', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: { dataDictionaryVersion: 'DDV6' },
    })

    cy.signIn()
  })

  it('Should display validation error messages', () => {
    const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

    page.form.continueButton.click()

    page.form.organisationField.shouldHaveValidationMessage('Select the organisation you are apart of')
    page.form.emailField.shouldHaveValidationMessage("Enter your team's email address")
    page.errorSummary.shouldExist()
    page.errorSummary.verifyErrorSummary([
      'Select the organisation you are apart of',
      "Enter your team's email address",
    ])
  })

  it('Should display validation error messages if only entered notifying organisation', () => {
    const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

    page.form.fillInWith({
      notifyingOrganisation: 'Prison',
      notifyingOrganisationEmailAddress: 'a@b.com',
    })

    page.form.continueButton.click()

    page.form.prisonField.shouldHaveValidationMessage('Select the name of the organisation you are apart of')
    page.errorSummary.shouldExist()
    page.errorSummary.verifyErrorSummary(['Select the name of the organisation you are apart of'])
  })
})
