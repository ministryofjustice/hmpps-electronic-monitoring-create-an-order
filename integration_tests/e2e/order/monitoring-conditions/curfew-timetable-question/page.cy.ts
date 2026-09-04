import { v4 as uuidv4 } from 'uuid'
import CurfewTimetableQuestionPage from '../../../../pages/order/monitoring-conditions/curfew-timetable-question'
import Page from '../../../../pages/page'

const mockOrderId = uuidv4()

context('Monitoring conditions - Curfew timetable question', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoListOrders')
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        interestedParties: { notifyingOrganisation: 'PRISON' },
      },
    })

    cy.signIn()
  })

  it('Should display the standard curfew times question', () => {
    const page = Page.visit(CurfewTimetableQuestionPage, { orderId: mockOrderId })

    page.form.standardCurfewTimesField.shouldHaveAllOptions()
  })
})
