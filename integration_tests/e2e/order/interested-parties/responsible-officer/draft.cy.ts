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

  it('has correct elements', () => {
    const page = Page.visit(ResponsibleOfficerPage, { orderId: mockOrderId })

    page.form.firstNameField.shouldExist()
    page.form.lastNameField.shouldExist()
    page.form.emailField.shouldExist()
  })
})
