import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import ProbationDeliveryUnitPage from './probationDeliveryUnitPage'

const mockOrderId = uuidv4()

context('probation delivery unit page', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: { dataDictionaryVersion: 'DDV6' },
    })
    cy.signIn()
  })

  it('Has correct elements', () => {
    const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

    page.form.unitField.shouldExist()
    page.form.unitField.shouldHaveAllOptions()

    page.form.continueButton.should('exist')
  })
})
