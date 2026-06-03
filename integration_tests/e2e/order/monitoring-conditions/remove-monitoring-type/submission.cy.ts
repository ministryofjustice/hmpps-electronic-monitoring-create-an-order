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
    interestedParties: null,
    monitoringConditionsAlcohol: null,
  }

  const removeCurfewTypePath = `/monitoring-conditions/monitoring-type/${mockOrder.curfewConditions.id}`
  const removeTagAtSourcePath = '/monitoring-conditions/tag-at-source'
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', order: mockOrder })

    cy.task('stubDeleteOrder', { httpStatus: 200, id: mockOrderId, subPath: removeCurfewTypePath, response: {} })
    cy.task('stubDeleteOrder', { httpStatus: 200, id: mockOrderId, subPath: removeTagAtSourcePath, response: {} })

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
      uri: `/orders/${mockOrderId}${removeCurfewTypePath}`,
      method: 'DELETE',
      body: '',
    }).should('be.true')
  })

  it('removing the last condition', () => {
    mockOrder.monitoringConditionsTrail = null

    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', order: mockOrder })

    const page = Page.visit(RemoveMonitoringTypePage, { orderId: mockOrderId, monitoringTypeId: 'curfewId' })
    page.confirmRemoveButton().click()
    Page.verifyOnPage(MonitoringTypePage)

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${removeTagAtSourcePath}`,
      method: 'DELETE',
      body: '',
    }).should('be.true')
  })

  it('removing alcohol when not in pilot removes tag at source', () => {
    mockOrder.interestedParties = {
      notifyingOrganisation: 'PRISON',
      notifyingOrganisationName: 'SOME PRISON NOT IN PILOT',
      notifyingOrganisationEmail: 'test@test.com',
      responsibleOfficerName: 'John Smith',
      responsibleOfficerPhoneNumber: '01234567890',
      responsibleOrganisation: 'PROBATION',
      responsibleOrganisationRegion: 'NORTH_EAST',
      responsibleOrganisationEmail: 'test2@test.com',
    }
    mockOrder.monitoringConditionsAlcohol = {
      monitoringType: 'ALCOHOL_ABSTINENCE',
      startDate: '2024-03-27T00:00:00.000Z',
      endDate: '2025-04-28T00:00:00.000Z',
      id: 'alcoholId',
    }

    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', order: mockOrder })
    const removeAlcoholTypePath = `/monitoring-conditions/monitoring-type/${mockOrder.monitoringConditionsAlcohol.id}`
    cy.task('stubDeleteOrder', { httpStatus: 200, id: mockOrderId, subPath: removeAlcoholTypePath, response: {} })

    const page = Page.visit(RemoveMonitoringTypePage, { orderId: mockOrderId, monitoringTypeId: 'alcoholId' })
    page.confirmRemoveButton().click()
    Page.verifyOnPage(TypesOfMonitoringNeededPage)

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${removeTagAtSourcePath}`,
      method: 'DELETE',
      body: '',
    }).should('be.true')
  })
})
