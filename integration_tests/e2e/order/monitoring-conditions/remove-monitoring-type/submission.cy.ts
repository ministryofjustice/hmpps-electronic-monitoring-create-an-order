import { v4 as uuidv4 } from 'uuid'
import RemoveMonitoringTypePage from './RemoveMonitoringTypePage'
import Page from '../../../../pages/page'
import TypesOfMonitoringNeededPage from '../order-type-description/types-of-monitoring-needed/TypesOfMonitoringNeededPage'
import MonitoringTypePage from '../order-type-description/monitoring-type/MonitoringTypesPage'

const mockOrderId = uuidv4()

context('Confirm delete', () => {
  const mockOrder = {
    curfewConditions: {
      curfewAddress: 'PRIMARY,SECONDARY',
      startDate: '2024-11-11T00:00:00Z',
      endDate: '2024-11-11T00:00:00Z',
      curfewAdditionalDetails: 'some additional details',
      id: 'curfewId',
    },
    monitoringConditionsTrail: {
      startDate: '2024-11-11T00:00:00Z',
      endDate: '2024-11-11T00:00:00Z',
      id: 'trailId',
    },
  }
  const path = `/monitoring-conditions/monitoring-type/${mockOrder.curfewConditions.id}`
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', order: mockOrder })

    cy.task('stubDeleteOrder', { httpStatus: 200, id: mockOrderId, subPath: path, response: {} })

    cy.signIn()
  })

  it('routes back to list view when cancel button is clicked', () => {
    const page = Page.visit(RemoveMonitoringTypePage, { orderId: mockOrderId, monitoringTypeId: 'curfewId' })
    page.cancelButton().click()
    Page.verifyOnPage(TypesOfMonitoringNeededPage)
  })

  it('routes to list view when remove button is clicked', () => {
    const page = Page.visit(RemoveMonitoringTypePage, { orderId: mockOrderId, monitoringTypeId: 'curfewId' })
    page.confirmRemoveButton().click()
    Page.verifyOnPage(TypesOfMonitoringNeededPage)

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${path}`,
      method: 'DELETE',
      body: '',
    }).should('be.true')
  })

  it('routes to list view when remove button is clicked and last type is removed', () => {
    mockOrder.monitoringConditionsTrail = null

    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', order: mockOrder })

    const page = Page.visit(RemoveMonitoringTypePage, { orderId: mockOrderId, monitoringTypeId: 'curfewId' })
    page.confirmRemoveButton().click()
    Page.verifyOnPage(MonitoringTypePage)
  })
})
