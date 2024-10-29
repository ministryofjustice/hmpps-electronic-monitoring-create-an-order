import { v4 as uuidv4 } from 'uuid'
import { mockApiOrder } from '../../../mockApis/cemo'
import ErrorPage from '../../../pages/error'
import AlcoholMonitoringPage from '../../../pages/order/monitoring-conditions/alcohol-monitoring'
import AttendanceMonitoringPage from '../../../pages/order/monitoring-conditions/attendance-monitoring'
import TrailMonitoringPage from '../../../pages/order/trailMonitoring'
import Page from '../../../pages/page'

const mockOrderId = uuidv4()
const mockConditionId = uuidv4()

const monitoringConditions = {
  orderType: 'immigration',
  acquisitiveCrime: true,
  dapol: true,
  curfew: false,
  exclusionZone: false,
  trail: false,
  mandatoryAttendance: true,
  alcohol: true,
  devicesRequired: [
    'Location - fitted',
    'Location - non-fitted',
    'RF',
    'Alcohol (Transdermal)',
    'Alcohol (Remote Breath)',
  ],
}

const mockEmptyAttendanceMonitoring = {
  ...mockApiOrder('IN_PROGRESS'),
  monitoringConditionsAttendance: [
    {
      id: mockConditionId,
      startDate: null,
      endDate: null,
      purpose: null,
      appointmentDay: null,
      startTime: null,
      endTime: null,
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      addressLine4: null,
      postcode: null,
    },
  ],
  monitoringConditions,
  id: mockOrderId,
}

const mockSubmittedAttendanceMonitoring = {
  ...mockApiOrder('SUBMITTED'),
  monitoringConditionsAttendance: [
    {
      id: mockConditionId,
      startDate: '2024-03-27T00:00:00.000Z',
      endDate: '2025-04-28T00:00:00.000Z',
      purpose: 'To attend',
      appointmentDay: 'Monday',
      startTime: '10:00:00',
      endTime: '11:00:00',
      addressLine1: '19 Strawberry Fields',
      addressLine2: 'Liverpool',
      addressLine3: 'Line 3',
      addressLine4: 'Line 4',
      postcode: 'LV3 4DG',
    },
  ],
  id: mockOrderId,
}

const mockInProgressAttendanceMonitoring = {
  ...mockSubmittedAttendanceMonitoring,
  status: 'IN_PROGRESS',
}

const checkFormFields = () => {
  cy.get('input[name="startDate-day"]').should('have.value', '27')
  cy.get('input[name="startDate-month"]').should('have.value', '3')
  cy.get('input[name="startDate-year"]').should('have.value', '2024')
  cy.get('input[name="endDate-day"]').should('have.value', '28')
  cy.get('input[name="endDate-month"]').should('have.value', '4')
  cy.get('input[name="endDate-year"]').should('have.value', '2025')
  cy.get('input[name="purpose"]').should('have.value', 'To attend')
  cy.get('input[name="appointmentDay"]').should('have.value', 'Monday')
  cy.get('input[name="startTimeHours"]').should('have.value', '10')
  cy.get('input[name="startTimeMinutes"]').should('have.value', '00')
  cy.get('input[name="endTimeHours"]').should('have.value', '11')
  cy.get('input[name="endTimeMinutes"]').should('have.value', '00')
  cy.get('input[name="addressLine1"]').should('have.value', '19 Strawberry Fields')
  cy.get('input[name="addressLine2"]').should('have.value', 'Liverpool')
  cy.get('input[name="addressLine3"]').should('have.value', 'Line 3')
  cy.get('input[name="addressLine4"]').should('have.value', 'Line 4')
  cy.get('input[name="addressPostcode"]').should('have.value', 'LV3 4DG')
}

context('Attendance monitoring', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoListOrders')
  })

  context('Draft order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
    })

    it('Should display the form', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/attendance`)
      const page = Page.verifyOnPage(TrailMonitoringPage)
      page.subHeader().should('contain.text', 'Attendance monitoring')
      page.header.userName().should('contain.text', 'J. Smith')
    })
  })

  context('Submitted Order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: mockSubmittedAttendanceMonitoring,
      })
    })

    it('Should correctly display the submitted data in disabled fields', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/attendance/${mockConditionId}`)
      const page = Page.verifyOnPage(AttendanceMonitoringPage)
      page.submittedBanner.should('contain', 'You are viewing a submitted order.')
      cy.get('input[type="text"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      cy.get('input[type="number"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      checkFormFields()
      page.saveAndContinueButton().should('not.exist')
      page.saveAndReturnButton().should('not.exist')
      page.backToSummaryButton.should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)
    })
  })

  context('Unsubmitted Order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockInProgressAttendanceMonitoring,
      })
    })

    it('Should correctly display the unsubmitted data in enabled fields', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/attendance/${mockConditionId}`)
      const page = Page.verifyOnPage(AttendanceMonitoringPage)
      cy.root().should('not.contain', 'You are viewing a submitted order.')
      cy.get('input[type="text"]').each($el => {
        cy.wrap($el).should('not.be.disabled')
      })
      cy.get('input[type="number"]').each($el => {
        cy.wrap($el).should('not.be.disabled')
      })
      checkFormFields()
      page.saveAndContinueButton().should('exist')
      page.saveAndReturnButton().should('exist')
    })
  })

  context.skip('Submitting the form', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockEmptyAttendanceMonitoring,
      })
    })

    it('should show errors with an empty form submission', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 400,
        id: mockOrderId,
        subPath: '/monitoring-conditions-attendance',
        response: [
          { field: 'startDate', error: 'You must enter a valid date' },
          { field: 'endDate', error: 'You must enter a valid date' },
          { field: 'purpose', error: 'You must enter a valid purpose' },
          { field: 'appointmentDay', error: 'You must enter a valid appointment day' },
          { field: 'startTime', error: 'You must enter a valid time' },
          { field: 'endTime', error: 'You must enter a valid time' },
          { field: 'address', error: 'You must enter a valid address' },
        ],
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/attendance`)
      const page = Page.verifyOnPage(AttendanceMonitoringPage)
      page.saveAndContinueButton().click()
      cy.get('#startDate-error').should('contain', 'You must enter a valid date')
      cy.get('#endDate-error').should('contain', 'You must enter a valid date')
      cy.get('#purpose-error').should('contain', 'You must enter a valid purpose')
      cy.get('#appointmentDay-error').should('contain', 'You must enter a valid appointment day')
      cy.get('#startTime-error').should('contain', 'You must enter a valid time')
      cy.get('#endTime-error').should('contain', 'You must enter a valid time')
      cy.get('#address-error').should('contain', 'You must enter a valid address')
    })

    it('should correctly submit the data to the CEMO API and move to the next selected page', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/monitoring-conditions-attendance',
        response: mockEmptyAttendanceMonitoring.monitoringConditionsAttendance[0],
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/attendance`)
      const page = Page.verifyOnPage(AttendanceMonitoringPage)
      page.fillInForm()
      cy.get('input[type="radio"][value="false"]').check()
      page.saveAndContinueButton().click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions-attendance`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          startDate: '2024-03-27T00:00:00.000Z',
          endDate: '2025-04-28T00:00:00.000Z',
          purpose: 'The purpose',
          appointmentDay: 'Monday',
          startTime: '18:15:00',
          endTime: '19:30:00',
          addressLine1: 'Address line 1',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressLine4: 'Address line 4',
          postcode: 'Postcode',
        })
      })
      Page.verifyOnPage(AlcoholMonitoringPage)
    })

    it('should allow a second entry to be created', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/monitoring-conditions-attendance',
        response: mockEmptyAttendanceMonitoring.monitoringConditionsAttendance[0],
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/attendance`)
      const page = Page.verifyOnPage(AttendanceMonitoringPage)
      page.fillInForm()
      cy.get('input[type="radio"][value="true"]').check()
      page.saveAndContinueButton().click()
      const secondPage = Page.verifyOnPage(AttendanceMonitoringPage)
      secondPage.fillInForm()
      cy.get('input[type="radio"][value="false"]').check()
      secondPage.saveAndContinueButton().click()
      Page.verifyOnPage(AlcoholMonitoringPage)
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/attendance`, { failOnStatusCode: false })

      Page.verifyOnPage(ErrorPage, 'Not Found')
    })
  })
})
