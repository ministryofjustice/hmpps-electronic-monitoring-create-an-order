import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import DapoPage from './DapoPage'

const mockOrderId = uuidv4()
context('dapo order clause', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
    })

    cy.signIn()
  })

  it('has correct elements', () => {
    const page = Page.visit(DapoPage, { orderId: mockOrderId })

    page.form.clauseNumberField.shouldExist()
    page.form.clauseNumberField.shouldNotBeDisabled()
    page.form.dateField.shouldExist()
    page.form.dateField.shouldNotBeDisabled()

    page.form.saveAndContinueButton.should('exist')
    page.form.saveAsDraftButton.should('exist')
  })
})
