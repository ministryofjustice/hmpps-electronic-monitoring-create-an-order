import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import NotifyingOrganisationPage from './notifyingOrganisationPage'

const mockOrderId = uuidv4()
context('notifying organisation page', () => {
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

  it('has correct elements', () => {
    const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

    page.form.organisationField.shouldExist()
    page.form.organisationField.shouldHaveAllOptions()

    page.form.emailField.shouldExist()

    page.form.continueButton.should('exist')
  })
})
