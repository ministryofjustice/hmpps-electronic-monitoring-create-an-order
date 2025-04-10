import { v4 as uuidv4 } from 'uuid'
import { mockApiOrder } from '../../../../mockApis/cemo'
import CurfewTimetablePage from '../../../../pages/order/monitoring-conditions/curfew-timetable'
import Page from '../../../../pages/page'
import expectations from './expectations'

const mockOrderId = uuidv4()
const apiPath = '/monitoring-conditions-curfew-timetable'
const mockInProgressCurfew = {
  ...mockApiOrder('IN_PROGRESS'),
  status: 'IN_PROGRESS',
  addresses: [
    {
      addressType: 'PRIMARY',
      addressLine1: '10 Downing Street',
      addressLine2: '',
      addressLine3: '',
      addressLine4: '',
      postcode: '',
    },
    {
      addressType: 'SECONDARY',
      addressLine1: '11 Downing Street',
      addressLine2: '',
      addressLine3: '',
      addressLine4: '',
      postcode: '',
    },
    {
      addressType: 'TERTIARY',
      addressLine1: '12 Downing Street',
      addressLine2: '',
      addressLine3: '',
      addressLine4: '',
      postcode: '',
    },
  ],
  id: mockOrderId,
}
context('Monitoring conditions - Curfew timetable', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: mockInProgressCurfew,
    })

    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: apiPath,
      response: [],
    })

    cy.task('stubCemoListOrders')

    cy.signIn()
  })

  context('Day time only requirements', () => {
    context('Submitting a valid single day timetable', () => {
      it('should correctly submit the data to the CEMO API', () => {
        const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

        const validFormData = [
          {
            day: 'Monday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
        ]

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: expectations.singleDay('MONDAY', mockOrderId, '07:00:00', '19:00:00', 'PRIMARY_ADDRESS'),
        }).should('be.true')
      })
    })

    context('Submitting a valid multi day timetable', () => {
      it('should correctly submit the data to the CEMO API', () => {
        const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

        const validFormData = [
          {
            day: 'Monday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Tuesday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Friday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
        ]

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: expectations.multiDays(
            ['MONDAY', 'TUESDAY', 'FRIDAY'],
            mockOrderId,
            '07:00:00',
            '19:00:00',
            'PRIMARY_ADDRESS',
          ),
        }).should('be.true')
      })
    })

    context('Submitting a valid 7 day timetable', () => {
      it('should correctly submit the data to the CEMO API and move to the next selected page', () => {
        const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

        const validFormData = [
          {
            day: 'Monday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Tuesday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Wednesday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Thursday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Friday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Saturday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Sunday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
        ]

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: expectations.allDays(mockOrderId, '07:00:00', '19:00:00', 'PRIMARY_ADDRESS'),
        }).should('be.true')
      })
    })

    context('Submitting a valid weekend only timetable', () => {
      it('should correctly submit the data to the CEMO API and move to the next selected page', () => {
        const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

        const validFormData = [
          {
            day: 'Saturday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Sunday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
        ]

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: expectations.weekendOnly(mockOrderId, '07:00:00', '19:00:00', 'PRIMARY_ADDRESS'),
        }).should('be.true')
      })
    })

    context('Submitting a valid weekday timetable', () => {
      it('should correctly submit the data to the CEMO API and move to the next selected page', () => {
        const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

        const validFormData = [
          {
            day: 'Monday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Tuesday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Wednesday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Thursday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Friday',
            startTime: '07:00:00',
            endTime: '19:00:00',
            addresses: [/Main address/],
          },
        ]

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: expectations.weekdaysOnly(mockOrderId, '07:00:00', '19:00:00', 'PRIMARY_ADDRESS'),
        }).should('be.true')
      })
    })
  })

  context('Overnight requirements', () => {
    context('Submitting a valid single night timetable', () => {
      it('should correctly submit the data to the CEMO API', () => {
        const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

        const validFormData = [
          {
            day: 'Wednesday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
          {
            day: 'Thursday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
        ]

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: expectations.singleNight('WEDNESDAY', mockOrderId, '19:00:00', '07:00:00', 'PRIMARY_ADDRESS'),
        }).should('be.true')
      })
    })

    context('Submitting a valid multi night timetable', () => {
      it('should correctly submit the data to the CEMO API', () => {
        const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

        const validFormData = [
          {
            day: 'Monday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
          {
            day: 'Tuesday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Tuesday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
          {
            day: 'Wednesday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Friday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
          {
            day: 'Saturday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
        ]

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: expectations.multiNights(
            ['MONDAY', 'TUESDAY', 'FRIDAY'],
            mockOrderId,
            '19:00:00',
            '07:00:00',
            'PRIMARY_ADDRESS',
          ),
        }).should('be.true')
      })
    })

    context('Submitting a valid 7 night timetable', () => {
      it('should correctly submit the data to the CEMO API and move to the next selected page', () => {
        const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

        const validFormData = [
          {
            day: 'Monday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Monday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
          {
            day: 'Tuesday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Tuesday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
          {
            day: 'Wednesday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Wednesday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
          {
            day: 'Thursday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Thursday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
          {
            day: 'Friday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Friday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
          {
            day: 'Saturday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Saturday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
          {
            day: 'Sunday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Sunday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
        ]

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: expectations.allNights(mockOrderId, '19:00:00', '07:00:00', 'PRIMARY_ADDRESS'),
        }).should('be.true')
      })
    })

    context('Submitting a valid weekend nights only timetable', () => {
      it('should correctly submit the data to the CEMO API and move to the next selected page', () => {
        const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

        const validFormData = [
          {
            day: 'Saturday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
          {
            day: 'Sunday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Sunday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
          {
            day: 'Monday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
        ]

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: expectations.weekendNightsOnly(mockOrderId, '19:00:00', '07:00:00', 'PRIMARY_ADDRESS'),
        }).should('be.true')
      })
    })

    context('Submitting a valid week night timetable', () => {
      it('should correctly submit the data to the CEMO API and move to the next selected page', () => {
        const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

        const validFormData = [
          {
            day: 'Monday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
          {
            day: 'Tuesday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Tuesday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
          {
            day: 'Wednesday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Wednesday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
          {
            day: 'Thursday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Thursday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
          {
            day: 'Friday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
          {
            day: 'Friday',
            startTime: '19:00:00',
            endTime: '23:59:00',
            addresses: [/Main address/],
          },
          {
            day: 'Saturday',
            startTime: '00:00:00',
            endTime: '07:00:00',
            addresses: [/Main address/],
          },
        ]

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: expectations.weekNightsOnly(mockOrderId, '19:00:00', '07:00:00', 'PRIMARY_ADDRESS'),
        }).should('be.true')
      })
    })
  })

  context('when the user chooses to auto-populate the other days', () => {
    it('copies the monday entry to all empty days', () => {
      const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

      page.form.fillInWith([
        {
          day: 'Monday',
          startTime: '19:00:00',
          endTime: '10:00:00',
          addresses: [/Main address/],
        },
      ])

      page.form.autoPopulateTimetable()
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${apiPath}`,
        body: expectations.allDays(mockOrderId, '19:00:00', '10:00:00', 'PRIMARY_ADDRESS'),
      }).should('be.true')
    })

    it('copies the monday entry over all filled days', () => {
      const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

      page.form.fillInWith([
        {
          day: 'Monday',
          startTime: '19:00:00',
          endTime: '07:00:00',
          addresses: [/Main address/],
        },
        {
          day: 'Wednesday',
          startTime: '07:00:00',
          endTime: '10:00:00',
          addresses: [/Second address/],
        },
        {
          day: 'Friday',
          startTime: '21:00:00',
          endTime: '07:00:00',
          addresses: [/Main address/, /Second address/],
        },
      ])

      page.form.autoPopulateTimetable()
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${apiPath}`,
        body: expectations.allDays(mockOrderId, '19:00:00', '07:00:00', 'PRIMARY_ADDRESS'),
      }).should('be.true')
    })

    it('copies the monday entry over all days and removes additional entries', () => {
      const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

      page.form.fillInWith([
        {
          day: 'Monday',
          startTime: '16:00:00',
          endTime: '04:00:00',
          addresses: [/Main address/],
        },
        {
          day: 'Tuesday',
          startTime: '22:00:00',
          endTime: '23:59:00',
          addresses: [/Second address/],
        },
        {
          day: 'Tuesday',
          startTime: '00:00:00',
          endTime: '10:00:00',
          addresses: [/Second address/],
        },
        {
          day: 'Thursday',
          startTime: '19:00:00',
          endTime: '23:59:00',
          addresses: [/Main address/, /Second address/],
        },
        {
          day: 'Thursday',
          startTime: '00:00:00',
          endTime: '07:00:00',
          addresses: [/Main address/, /Second address/],
        },
      ])

      page.form.autoPopulateTimetable()
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${apiPath}`,
        body: expectations.allDays(mockOrderId, '16:00:00', '04:00:00', 'PRIMARY_ADDRESS'),
      }).should('be.true')
    })
  })
})
