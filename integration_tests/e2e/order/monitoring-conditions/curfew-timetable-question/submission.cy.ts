import { v4 as uuidv4 } from 'uuid'
import CurfewTimetableQuestionPage from '../../../../pages/order/monitoring-conditions/curfew-timetable-question'
import CurfewTimetablePage from '../../../../pages/order/monitoring-conditions/curfew-timetable'
import OrderSummaryPage from '../../../../pages/order/summary'
import TypesOfMonitoringNeededPage from '../order-type-description/types-of-monitoring-needed/TypesOfMonitoringNeededPage'
import Page from '../../../../pages/page'
import mockApiOrder from '../../../../utils/data/ApiOrder'

const mockOrderId = uuidv4()
const apiPath = '/monitoring-conditions-curfew-timetable'

const mockOrder = {
  ...mockApiOrder('IN_PROGRESS'),
  interestedParties: {
    notifyingOrganisation: 'PRISON',
  },
  isSentencingAct: true,
  curfewConditions: {
    startDate: null,
    endDate: null,
    curfewAddress: '10 Downing Street, London, SW1A 2AA',
    curfewAdditionalDetails: '',
  },
  id: mockOrderId,
}

context('Monitoring conditions - Curfew timetable question - submission', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoListOrders')
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: mockOrder,
    })

    cy.signIn()
  })

  it('should continue to the curfew timetable page when I check the no radio button', () => {
    const page = Page.visit(CurfewTimetableQuestionPage, { orderId: mockOrderId })

    page.form.standardCurfewTimesField.set('No')
    page.form.saveAndContinueButton.click()

    Page.verifyOnPage(CurfewTimetablePage)
  })

  it('should return to the order summary when I select no and save as draft', () => {
    const page = Page.visit(CurfewTimetableQuestionPage, { orderId: mockOrderId })

    page.form.standardCurfewTimesField.set('No')
    page.form.saveAsDraftButton.click()

    Page.verifyOnPage(OrderSummaryPage)
  })

  it('should save the standard 19:00-07:00 curfew timetable and continue to the types of monitoring needed page when I check the yes radio button', () => {
    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: apiPath,
      response: [
        {
          dayOfWeek: 'MONDAY',
          curfewAddress: mockOrder.curfewConditions.curfewAddress,
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
      ],
    })

    const page = Page.visit(CurfewTimetableQuestionPage, { orderId: mockOrderId })

    page.form.standardCurfewTimesField.set('Yes')
    page.form.saveAndContinueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${apiPath}`,
      body: [
        {
          dayOfWeek: 'MONDAY',
          curfewAddress: mockOrder.curfewConditions.curfewAddress,
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'TUESDAY',
          curfewAddress: mockOrder.curfewConditions.curfewAddress,
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'WEDNESDAY',
          curfewAddress: mockOrder.curfewConditions.curfewAddress,
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'THURSDAY',
          curfewAddress: mockOrder.curfewConditions.curfewAddress,
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'FRIDAY',
          curfewAddress: mockOrder.curfewConditions.curfewAddress,
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'SATURDAY',
          curfewAddress: mockOrder.curfewConditions.curfewAddress,
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'SUNDAY',
          curfewAddress: mockOrder.curfewConditions.curfewAddress,
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
      ],
    }).should('be.true')

    Page.verifyOnPage(TypesOfMonitoringNeededPage)
  })

  it('should save the standard 19:00-07:00 curfew timetable and return to the order summary when I select yes and save as draft', () => {
    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: apiPath,
      response: [
        {
          dayOfWeek: 'MONDAY',
          curfewAddress: mockOrder.curfewConditions.curfewAddress,
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
      ],
    })

    const page = Page.visit(CurfewTimetableQuestionPage, { orderId: mockOrderId })

    page.form.standardCurfewTimesField.set('Yes')
    page.form.saveAsDraftButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${apiPath}`,
      body: [
        {
          dayOfWeek: 'MONDAY',
          curfewAddress: mockOrder.curfewConditions.curfewAddress,
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'TUESDAY',
          curfewAddress: mockOrder.curfewConditions.curfewAddress,
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'WEDNESDAY',
          curfewAddress: mockOrder.curfewConditions.curfewAddress,
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'THURSDAY',
          curfewAddress: mockOrder.curfewConditions.curfewAddress,
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'FRIDAY',
          curfewAddress: mockOrder.curfewConditions.curfewAddress,
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'SATURDAY',
          curfewAddress: mockOrder.curfewConditions.curfewAddress,
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'SUNDAY',
          curfewAddress: mockOrder.curfewConditions.curfewAddress,
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
      ],
    }).should('be.true')

    Page.verifyOnPage(OrderSummaryPage)
  })
})
