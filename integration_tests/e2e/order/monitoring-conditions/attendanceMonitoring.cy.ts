import { v4 as uuidv4 } from 'uuid'
import { mockApiOrder } from '../../../mockApis/cemo'
import ErrorPage from '../../../pages/error'
import AlcoholMonitoringPage from '../../../pages/order/monitoring-conditions/alcohol-monitoring'
import AttendanceMonitoringPage from '../../../pages/order/monitoring-conditions/attendance-monitoring'
import Page from '../../../pages/page'

const mockOrderId = uuidv4()
const mockConditionId = uuidv4()

const monitoringConditions = {
  orderType: 'IMMIGRATION',
  acquisitiveCrime: true,
  dapol: true,
  curfew: false,
  exclusionZone: false,
  trail: false,
  mandatoryAttendance: true,
  alcohol: true,
}

const mockEmptyAttendanceMonitoring = {
  ...mockApiOrder('IN_PROGRESS'),
  mandatoryAttendanceConditions: [
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
  mandatoryAttendanceConditions: [
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

const validFormData = {
  tartDate: new Date(2024, 3, 27),
  endDate: new Date(2024, 4, 28),
  purpose: 'The purpose',
  appointmentDay: 'Monday',
  startTime: {
    hours: '18',
    minutes: '15',
  },
  endTime: {
    hours: '19',
    minutes: '30',
  },
  address: {
    line1: 'Address line 1',
    line2: 'Address line 2',
    line3: 'Address line 3',
    line4: 'Address line 4',
    postcode: 'Postcode',
  },
  addAnother: 'false',
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
      const page = Page.verifyOnPage(AttendanceMonitoringPage)
      page.header.userName().should('contain.text', 'J. Smith')
      page.errorSummary.shouldNotExist()
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
      page.form.startDateField.shouldHaveValue(new Date(2024, 2, 27))
      page.form.endDateField.shouldHaveValue(new Date(2025, 3, 28))
      page.form.purposeField.shouldHaveValue('To attend')
      page.form.appointmentDayField.shouldHaveValue('Monday')
      page.form.startTimeField.shouldHaveValue({ hours: '10', minutes: '00' })
      page.form.endTimeField.shouldHaveValue({ hours: '11', minutes: '00' })
      page.form.addressField.shouldHaveValue({
        line1: '19 Strawberry Fields',
        line2: 'Liverpool',
        line3: 'Line 3',
        line4: 'Line 4',
        postcode: 'LV3 4DG',
      })
      page.form.shouldBeDisabled()
      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAndReturnButton.should('not.exist')
      page.errorSummary.shouldNotExist()
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
      page.form.startDateField.shouldHaveValue(new Date(2024, 2, 27))
      page.form.endDateField.shouldHaveValue(new Date(2025, 3, 28))
      page.form.purposeField.shouldHaveValue('To attend')
      page.form.appointmentDayField.shouldHaveValue('Monday')
      page.form.startTimeField.shouldHaveValue({ hours: '10', minutes: '00' })
      page.form.endTimeField.shouldHaveValue({ hours: '11', minutes: '00' })
      page.form.addressField.shouldHaveValue({
        line1: '19 Strawberry Fields',
        line2: 'Liverpool',
        line3: 'Line 3',
        line4: 'Line 4',
        postcode: 'LV3 4DG',
      })
      page.form.saveAndContinueButton.should('exist')
      page.form.saveAndReturnButton.should('exist')
      page.form.shouldNotBeDisabled()
      page.errorSummary.shouldNotExist()
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
        ],
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/attendance`)
      const page = Page.verifyOnPage(AttendanceMonitoringPage)
      page.form.saveAndContinueButton.click()
      page.form.startDateField.shouldHaveValidationMessage('You must enter a valid date')
      page.form.endDateField.shouldHaveValidationMessage('You must enter a valid date')
      page.form.purposeField.shouldHaveValidationMessage('You must enter a valid purpose')
      page.form.appointmentDayField.shouldHaveValidationMessage('You must enter a valid appointment day')
      page.form.startTimeField.shouldHaveValidationMessage('You must enter a valid time')
      page.form.endTimeField.shouldHaveValidationMessage('You must enter a valid time')
    })

    it('should correctly submit the data to the CEMO API and move to the next selected page', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/monitoring-conditions-attendance',
        response: mockEmptyAttendanceMonitoring.mandatoryAttendanceConditions[0],
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/attendance`)

      const page = Page.verifyOnPage(AttendanceMonitoringPage)
      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()

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
        response: mockEmptyAttendanceMonitoring.mandatoryAttendanceConditions[0],
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/attendance`)

      const page = Page.verifyOnPage(AttendanceMonitoringPage)
      page.form.fillInWith({ ...validFormData, addAnother: 'true' })
      page.form.saveAndContinueButton.click()

      const secondPage = Page.verifyOnPage(AttendanceMonitoringPage)
      secondPage.form.fillInWith(validFormData)
      secondPage.form.saveAndContinueButton.click()

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
