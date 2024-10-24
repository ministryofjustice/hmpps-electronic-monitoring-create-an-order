import { v4 as uuidv4 } from 'uuid'
import { CurfewTimetable } from '../../../../server/models/CurfewTimetable'
import { Order } from '../../../../server/models/Order'
import { deserialiseTime } from '../../../../server/utils/utils'
import { mockApiOrder } from '../../../mockApis/cemo'
import ErrorPage from '../../../pages/error'
import CurfewTimetablePage from '../../../pages/order/monitoring-conditions/curfew-timetable'
import OrderTasksPage from '../../../pages/order/summary'
import Page from '../../../pages/page'

const mockOrderId = uuidv4()
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const mockSubmittedTimetable = {
  ...mockApiOrder('SUBMITTED'),
  curfewTimeTable: [
    {
      dayOfWeek: 'MONDAY',
      startTime: '09:15:00',
      endTime: '17:30:00',
      orderId: mockOrderId,
      curfewAddress: 'SECONDARY_ADDRESS',
    },
    {
      dayOfWeek: 'MONDAY',
      startTime: '08:25:00',
      endTime: '17:35:00',
      orderId: mockOrderId,
      curfewAddress: 'TERTIARY_ADDRESS',
    },
    {
      dayOfWeek: 'TUESDAY',
      startTime: '10:20:00',
      endTime: '17:30:00',
      orderId: mockOrderId,
      curfewAddress: 'SECONDARY_ADDRESS,TERTIARY_ADDRESS',
    },
    {
      dayOfWeek: 'WEDNESDAY',
      startTime: '08:15:00',
      endTime: '12:30:00',
      orderId: mockOrderId,
      curfewAddress: 'SECONDARY_ADDRESS',
    },
    {
      dayOfWeek: 'WEDNESDAY',
      startTime: '12:30:00',
      endTime: '17:30:00',
      orderId: mockOrderId,
      curfewAddress: 'TERTIARY_ADDRESS',
    },
    {
      dayOfWeek: 'THURSDAY',
      startTime: '07:00:00',
      endTime: '18:30:00',
      orderId: mockOrderId,
      curfewAddress: 'SECONDARY_ADDRESS',
    },
    {
      dayOfWeek: 'FRIDAY',
      startTime: '08:25:00',
      endTime: '14:35:00',
      orderId: mockOrderId,
      curfewAddress: 'SECONDARY_ADDRESS',
    },
    {
      dayOfWeek: 'FRIDAY',
      startTime: '14:35:00',
      endTime: '17:40:00',
      orderId: mockOrderId,
      curfewAddress: 'SECONDARY_ADDRESS,TERTIARY_ADDRESS',
    },
    {
      dayOfWeek: 'SATURDAY',
      startTime: '07:15:00',
      endTime: '19:30:00',
      orderId: mockOrderId,
      curfewAddress: 'SECONDARY_ADDRESS,TERTIARY_ADDRESS',
    },
    {
      dayOfWeek: 'SUNDAY',
      startTime: '06:15:00',
      endTime: '20:30:00',
      orderId: mockOrderId,
      curfewAddress: 'SECONDARY_ADDRESS,TERTIARY_ADDRESS',
    },
  ],
  id: mockOrderId,
} as Order

const mockInProgressTimetable = {
  ...mockSubmittedTimetable,
  status: 'IN_PROGRESS',
}

const mockEmptyTimetable = {
  ...mockApiOrder('SUBMITTED'),
  monitoringConditionsCurfewTimetable: [],
  status: 'IN_PROGRESS',
}

const checkFormFields = () => {
  const groupedTimetables = mockSubmittedTimetable.curfewTimeTable.reduce((acc: Record<string, CurfewTimetable>, t) => {
    if (!acc[t.dayOfWeek]) {
      acc[t.dayOfWeek] = []
    }
    acc[t.dayOfWeek].push(t)
    return acc
  }, {})
  Object.entries(groupedTimetables).forEach(([day, timetables]) => {
    timetables.forEach((t, index) => {
      const displayDay = day.toLowerCase()
      const [startHours, startMinutes] = deserialiseTime(t.startTime)
      const [endHours, endMinutes] = deserialiseTime(t.endTime)
      cy.get(`input#curfewTimetable-${displayDay}-${index}-time-start-hours`).should('have.value', startHours)
      cy.get(`input#curfewTimetable-${displayDay}-${index}-time-start-minutes`).should('have.value', startMinutes)
      cy.get(`input#curfewTimetable-${displayDay}-${index}-time-end-hours`).should('have.value', endHours)
      cy.get(`input#curfewTimetable-${displayDay}-${index}-time-end-minutes`).should('have.value', endMinutes)
      cy.get(`input#curfewTimetable-${displayDay}-${index}-addresses-PRIMARY_ADDRESS`).should(
        t.curfewAddress?.includes('PRIMARY_ADDRESS') ? 'be.checked' : 'not.be.checked',
      )
      cy.get(`input#curfewTimetable-${displayDay}-${index}-addresses-SECONDARY_ADDRESS`).should(
        t.curfewAddress?.includes('SECONDARY_ADDRESS') ? 'be.checked' : 'not.be.checked',
      )
      cy.get(`input#curfewTimetable-${displayDay}-${index}-addresses-TERTIARY_ADDRESS`).should(
        t.curfewAddress?.includes('TERTIARY_ADDRESS') ? 'be.checked' : 'not.be.checked',
      )
    })
  })
}

context('Curfew monitoring - Timetable', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoListOrders')
  })

  context('Draft order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
    })

    it('Should display the timetable form', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/timetable`)
      const page = Page.verifyOnPage(CurfewTimetablePage)
      days.forEach(day => {
        const lowerDay = day.toLowerCase()
        cy.get('h3').contains(day)
        cy.get(`input#curfewTimetable-${lowerDay}-0-time-start-hours`).should('exist')
        cy.get(`input#curfewTimetable-${lowerDay}-0-time-start-minutes`).should('exist')
        cy.get(`input#curfewTimetable-${lowerDay}-0-time-end-hours`).should('exist')
        cy.get(`input#curfewTimetable-${lowerDay}-0-time-end-minutes`).should('exist')
        cy.get(`input#curfewTimetable-${lowerDay}-0-addresses-PRIMARY_ADDRESS`).should('exist')
        cy.get(`input#curfewTimetable-${lowerDay}-0-addresses-SECONDARY_ADDRESS`).should('exist')
        cy.get(`input#curfewTimetable-${lowerDay}-0-addresses-TERTIARY_ADDRESS`).should('exist')
      })
      page.header.userName().should('contain.text', 'J. Smith')
    })
  })

  context('Submitted Order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: mockSubmittedTimetable,
      })
    })

    it('Should correctly display the submitted data in disabled fields', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/timetable`)
      const page = Page.verifyOnPage(CurfewTimetablePage)
      page.submittedBanner().should('contain', 'You are viewing a submitted order.')
      cy.get('input[type="number"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      cy.get('input[type="checkbox"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      checkFormFields()
      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAndReturnButton.should('not.exist')
      page.backToSummaryButton.should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)
    })
  })

  context('In Progress Order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockInProgressTimetable,
      })
    })

    it('Should correctly display the submitted data in disabled fields', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/timetable`)
      const page = Page.verifyOnPage(CurfewTimetablePage)
      cy.get('input[type="number"]').each($el => {
        cy.wrap($el).should('be.enabled')
      })
      cy.get('input[type="checkbox"]').each($el => {
        cy.wrap($el).should('be.enabled')
      })
      checkFormFields()
      page.form.saveAndContinueButton.should('exist')
      page.form.saveAndReturnButton.should('exist')
      page.backToSummaryButton.should('exist')
    })
  })

  context('Submitting the form', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockEmptyTimetable,
      })
    })

    it('should show errors for a form submission', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 400,
        id: mockOrderId,
        subPath: '/monitoring-conditions-curfew-timetable',
        response: [
          { index: 1, errors: [{ field: 'startTime', error: 'You must enter a valid start time' }] },
          {
            index: 3,
            errors: [
              { field: 'startTime', error: 'You must enter a valid start time' },
              { field: 'endTime', error: 'You must enter a valid end time' },
            ],
          },
          { index: 7, errors: [{ field: 'curfewAddress', error: 'You must select an address' }] },
        ],
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/timetable`)
      const page = Page.verifyOnPage(CurfewTimetablePage)
      page.fillInForm(mockSubmittedTimetable)
      page.form.saveAndContinueButton.click()
      checkFormFields()
      cy.get('#curfewTimetable-monday-1-time-error').should('contain', 'You must enter a valid start time')
      cy.get('#curfewTimetable-wednesday-0-time-error').should(
        'contain',
        'You must enter a valid start time, You must enter a valid end time',
      )
      cy.get('#curfewTimetable-friday-1-addresses-error').should('contain', 'You must select an address')
    })

    it('should correctly submit the data to the CEMO API and move to the next selected page', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/monitoring-conditions-curfew-timetable',
        response: mockSubmittedTimetable.curfewTimeTable,
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/timetable`)
      const page = Page.verifyOnPage(CurfewTimetablePage)
      page.fillInForm(mockSubmittedTimetable)
      page.form.saveAndContinueButton.click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions-curfew-timetable`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal(mockSubmittedTimetable.curfewTimeTable)
      })
      Page.verifyOnPage(OrderTasksPage)
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew-day-of-release`, {
        failOnStatusCode: false,
      })

      Page.verifyOnPage(ErrorPage, 'Not Found')
    })
  })
})
