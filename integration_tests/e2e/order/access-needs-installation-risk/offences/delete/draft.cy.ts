import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OffenceDeletePage from './OffenceListDeletePage'

const mockOrderId = uuidv4()
const mockOffenceId = uuidv4()
const mockDate = new Date(2025, 0, 1)
context('delete dapo', () => {
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
    const page = Page.visit(OffenceDeletePage, { orderId: mockOrderId, offenceId: mockOffenceId })

    page.fullTitle.contains('Are you sure that you want to delete this DAPO order clause?')
    page.form.containsHint('12345 on 01/01/2025')
    page.confirmDeleteButton().should('exist')
    page.cancelButton().should('exist')
  })
})

context('delete offence', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        offences: [
          {
            offenceType: 'SEXUAL_OFFENCES',
            offenceDate: mockDate.toISOString(),
            id: mockOffenceId,
          },
        ],
      },
    })

    cy.signIn()
  })

  it('has correct elements', () => {
    const page = Page.visit(OffenceDeletePage, { orderId: mockOrderId, offenceId: mockOffenceId })

    page.fullTitle.contains('Are you sure that you want to delete this offence?')
    page.form.containsHint('Sexual offences on 01/01/2025')
    page.confirmDeleteButton().should('exist')
    page.cancelButton().should('exist')
  })
})
