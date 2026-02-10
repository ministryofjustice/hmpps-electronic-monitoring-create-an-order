import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OffenceListDeletePage from './OffenceListDeletePage'

const mockOrderId = uuidv4()
const mockOffenceId = uuidv4()
const mockDate = new Date(2025, 1, 1)
context('dapo order clause', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        dapoClauses: [
          {
            clause: '12345',
            date: mockDate.toISOString(),
            id: mockOffenceId,
          },
        ],
      },
    })

    cy.signIn()
  })

  it('has correct elements', () => {
    const page = Page.visit(OffenceListDeletePage, { orderId: mockOrderId, offenceId: mockOffenceId })

    page.form.containsHint('12345 on 01/01/2025')
    page.confirmRemoveButton().should('exist')
    page.cancelButton().should('exist')
  })
})
