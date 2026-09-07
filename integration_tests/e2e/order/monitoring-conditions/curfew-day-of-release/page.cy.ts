import { v4 as uuidv4 } from 'uuid'
import CurfewDayOfReleasePage from '../../../../pages/order/monitoring-conditions/curfew-day-of-release'
import Page from '../../../../pages/page'

const mockOrderId = uuidv4()

context('Monitoring conditions - Curfew on day of release', () => {
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
    const page = Page.visit(CurfewDayOfReleasePage, { orderId: mockOrderId })

    page.form.standardCurfewTimesField.shouldHaveAllOptions()
    page.form.standardCurfewTimesField.shouldHaveHint(
      'On the day of release the standard times are 19:00 to 07:00 the next day. It can be later if the device wearer has a long way to travel',
    )
  })
})
