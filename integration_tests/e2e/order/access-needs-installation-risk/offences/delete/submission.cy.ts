import { v4 as uuidv4 } from 'uuid'
import { Order } from '../../../../../../server/models/Order'
import OffenceDeletePage from './OffenceListDeletePage'
import Page from '../../../../../pages/page'
import OffenceListPage from '../offence-list/offenceListPage'
import OffencePage from '../offence/offencePage'
import DapoPage from '../dapo/DapoPage'

const mockOrderId = uuidv4()
const mockOffenceId = uuidv4()
const mockDapoId = uuidv4()
const mockDate = new Date(2025, 0, 1)

context('offence delete page', () => {
  let mockOrder: Order
  const deleteOffencePath = `/offence/delete/${mockOffenceId}`
  const deleteDapoPath = `/dapo/delete/${mockDapoId}`
  beforeEach(() => {
    mockOrder = {
      offences: [
        { id: mockOffenceId, offenceType: 'THEFT_OFFENCES', offenceDate: mockDate.toISOString() },
        { id: uuidv4(), offenceType: 'SEXUAL_OFFENCES', offenceDate: new Date(2025, 1, 2).toISOString() },
      ],
      dapoClauses: [
        { id: mockDapoId, clause: '12345', date: mockDate.toISOString() },
        { id: uuidv4(), clause: '67890', date: new Date(2025, 1, 2).toISOString() },
      ],
    }

    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', order: mockOrder })

    cy.task('stubDeleteOrder', { httpStatus: 200, id: mockOrderId, subPath: deleteOffencePath, response: {} })
    cy.task('stubDeleteOrder', { httpStatus: 200, id: mockOrderId, subPath: deleteDapoPath, response: {} })

    cy.signIn()
  })

  it('routes back to list view when cancel button is clicked without deleting', () => {
    const page = Page.visit(OffenceDeletePage, { orderId: mockOrderId, offenceId: mockOffenceId })
    page.cancelButton().click()
    Page.verifyOnPage(OffenceListPage)
  })

  it('deletes offence correctly', () => {
    const page = Page.visit(OffenceDeletePage, { orderId: mockOrderId, offenceId: mockOffenceId })
    page.confirmDeleteButton().click()
    Page.verifyOnPage(OffenceListPage)

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${deleteOffencePath}`,
      method: 'DELETE',
      body: '',
    }).should('be.true')
  })

  it('deletes dapo clause correctly', () => {
    const page = Page.visit(OffenceDeletePage, { orderId: mockOrderId, offenceId: mockDapoId })
    page.confirmDeleteButton().click()
    Page.verifyOnPage(OffenceListPage)

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${deleteDapoPath}`,
      method: 'DELETE',
      body: '',
    }).should('be.true')
  })

  it('removing the last offence redirect to offence page', () => {
    mockOrder.offences = [mockOrder.offences[0]]
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', order: mockOrder })

    const page = Page.visit(OffenceDeletePage, { orderId: mockOrderId, offenceId: mockOffenceId })
    page.confirmDeleteButton().click()

    Page.verifyOnPage(OffencePage)
  })

  it('removing the last dapo redirect to dapo page', () => {
    mockOrder.dapoClauses = [mockOrder.dapoClauses[0]]
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', order: mockOrder })

    const page = Page.visit(OffenceDeletePage, { orderId: mockOrderId, offenceId: mockDapoId })
    page.confirmDeleteButton().click()

    Page.verifyOnPage(DapoPage)
  })
})
