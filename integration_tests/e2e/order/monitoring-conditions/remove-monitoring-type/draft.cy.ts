import { v4 as uuidv4 } from 'uuid'
import RemoveMonitoringTypePage from './RemoveMonitoringTypePage'
import Page from '../../../../pages/page'

const mockOrderId = uuidv4()

context('Confirm delete', () => {
  const mockOrder = {
    curfewConditions: {
      curfewAddress: 'PRIMARY,SECONDARY',
      endDate: '2024-11-11T00:00:00Z',
      startDate: '2024-11-11T00:00:00Z',
      curfewAdditionalDetails: 'some additional details',
      id: 'curfew id',
    },
  }
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', order: mockOrder })

    cy.signIn()
  })

  it('Should display the page', () => {
    const page = Page.visit(RemoveMonitoringTypePage, { orderId: mockOrderId, monitoringTypeId: 'curfew id' })
    page.header.userName().should('contain.text', 'J. Smith')

    page.confirmRemoveButton().should('exist')
    page.cancelButton().should('exist')
  })
})
