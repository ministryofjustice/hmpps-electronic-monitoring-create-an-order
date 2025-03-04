import { v4 as uuidv4 } from 'uuid'
import ErrorPage from '../../../pages/error'
import MonitoringConditionsPage from '../../../pages/order/monitoring-conditions'
import Page from '../../../pages/page'
import InstallationAddressPage from '../../../pages/order/monitoring-conditions/installation-address'

const mockSubmittedMonitoringRequirements = {
  monitoringConditions: {
    orderType: 'IMMIGRATION',
    orderTypeDescription: 'DAPOL',
    conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
    curfew: true,
    exclusionZone: true,
    trail: true,
    mandatoryAttendance: true,
    alcohol: true,
    startDate: '2024-10-10T11:00:00.000Z',
    endDate: '2024-10-11T11:00:00.000Z',
    sentenceType: 'EPP',
    issp: 'YES',
    hdc: 'NO',
    prarr: 'UNKNOWN',
  },
}

const mockEmptyMonitoringConditions = {
  monitoringConditions: {
    orderType: null,
    orderTypeDescription: null,
    conditionType: null,
    curfew: null,
    exclusionZone: null,
    trail: null,
    mandatoryAttendance: null,
    alcohol: null,
    startDate: null,
    endDate: null,
    sentenceType: null,
    issp: null,
    hdc: null,
    prarr: null,
  },
}

const validFormData = {
  orderType: 'IMMIGRATION',
  orderTypeDescription: 'GPS Acquisitive Crime HDC',
  monitoringRequired: [
    'Curfew with electronic monitoring',
    'Exclusion and inclusion zone monitoring',
    'Trail monitoring',
    'Mandatory attendance monitoring',
    'Alcohol monitoring',
  ],
  conditionType: 'License Condition of a Custodial Order',
  startDate: new Date('2024-02-27T11:02:00Z'),
  endDate: new Date('2025-03-08T04:40:00Z'),
  sentenceType: 'Extended Determinate Sentence',
  issp: 'No',
  hdc: 'Yes',
  prarr: 'Not able to provide this information',
}

const errorMessages = {
  conditionTypeRequired: 'Select order type condition',
  monitoringTypeRequired: 'Select monitoring required',
  orderTypeRequired: 'Select order type',
  startDateMustBeReal: 'Start date for monitoring must be a real date',
  startDateMustIncludeDay: 'Start date for monitoring must include a day',
  startDateMustIncludeMonth: 'Start date for monitoring must include a month',
  startDateMustIncludeYear: 'Start date for monitoring must include a year',
  startDateRequired: 'Enter start date for monitoring',
  yearMustIncludeFourNumbers: 'Year must include 4 numbers',
}

context('Monitoring conditions main section', () => {
  let mockOrderId: string

  beforeEach(() => {
    cy.task('reset')
    mockOrderId = uuidv4()
    cy.task('stubCemoListOrders')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
  })

  context('Draft order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
    })

    it('Should display the form', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions`)
      const page = Page.verifyOnPage(MonitoringConditionsPage)
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
        order: mockSubmittedMonitoringRequirements,
      })
    })

    it('Should correctly display the submitted data in disabled fields', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions`)
      const page = Page.verifyOnPage(MonitoringConditionsPage)
      page.submittedBanner.should('contain', 'You are viewing a submitted order.')
      page.form.monitoringRequiredField.shouldBeDisabled()
      page.form.orderTypeField.shouldHaveValue('IMMIGRATION')
      page.form.orderTypeField.shouldBeDisabled()
      page.form.sentenceTypeField.shouldHaveValue('EPP')
      page.form.isspField.shouldHaveValue('Yes')
      page.form.hdcField.shouldHaveValue('No')
      page.form.prarrField.shouldHaveValue('Not able to provide this information')
      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAndReturnButton.should('not.exist')
      page.backToSummaryButton.should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)
      page.errorSummary.shouldNotExist()
    })
  })

  context('Submitting the form', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockEmptyMonitoringConditions,
      })
    })

    it('should show frontend validation errors', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 400,
        id: mockOrderId,
        subPath: '/monitoring-conditions',
        response: [],
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions`)
      const page = Page.verifyOnPage(MonitoringConditionsPage)
      cy.get('input[type="checkbox"]').should('not.be.checked')
      cy.get('select[name="orderType"]').invoke('val').should('deep.equal', '')
      page.form.saveAndContinueButton.click()
      page.form.orderTypeField.shouldHaveValidationMessage(errorMessages.orderTypeRequired)
      page.form.conditionTypeField.shouldHaveValidationMessage(errorMessages.conditionTypeRequired)
      page.form.monitoringRequiredField.shouldHaveValidationMessage(errorMessages.monitoringTypeRequired)
      page.form.startDateField.shouldHaveValidationMessage(errorMessages.startDateRequired)
      page.errorSummary.shouldExist()
      page.errorSummary.shouldHaveError(errorMessages.orderTypeRequired)
      page.errorSummary.shouldHaveError(errorMessages.conditionTypeRequired)
      page.errorSummary.shouldHaveError(errorMessages.monitoringTypeRequired)
      page.errorSummary.shouldHaveError(errorMessages.startDateRequired)
    })

    it('after frontend validation passes, should show errors from API response', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 400,
        id: mockOrderId,
        subPath: '/monitoring-conditions',
        response: [
          { field: 'orderType', error: 'Test error - order type' },
          { field: 'orderTypeDescription', error: 'Test error - order type description' },
          { field: 'conditionType', error: 'Test error - condition type' },
          { field: 'updateMonitoringConditionsDto', error: 'Test error - monitoring required' },
          { field: 'startDate', error: 'Test error - start date' },
          { field: 'endDate', error: 'Test error - end date' },
        ],
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions`)
      const page = Page.verifyOnPage(MonitoringConditionsPage)
      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()
      page.form.orderTypeField.shouldHaveValidationMessage('Test error - order type')
      page.form.conditionTypeField.shouldHaveValidationMessage('Test error - condition type')
      page.form.monitoringRequiredField.shouldHaveValidationMessage('Test error - monitoring required')
      page.form.startDateField.shouldHaveValidationMessage('Test error - start date')
      page.form.endDateField.shouldHaveValidationMessage('Test error - end date')
      page.errorSummary.shouldExist()
      page.errorSummary.shouldHaveError('Test error - order type')
      page.errorSummary.shouldHaveError('Test error - condition type')
      page.errorSummary.shouldHaveError('Test error - monitoring required')
      page.errorSummary.shouldHaveError('Test error - start date')
      page.errorSummary.shouldHaveError('Test error - end date')
    })

    it('should correctly submit the data to the CEMO API and move to the next selected page', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/monitoring-conditions',
        response: mockEmptyMonitoringConditions.monitoringConditions,
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions`)
      const page = Page.verifyOnPage(MonitoringConditionsPage)
      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()
      Page.verifyOnPage(InstallationAddressPage)
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          orderType: 'IMMIGRATION',
          orderTypeDescription: 'GPS_ACQUISITIVE_CRIME_HDC',
          conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
          curfew: true,
          exclusionZone: true,
          trail: true,
          mandatoryAttendance: true,
          alcohol: true,
          startDate: '2024-02-27T11:02:00.000Z',
          endDate: '2025-03-08T04:40:00.000Z',
          sentenceType: 'EXTENDED_DETERMINATE_SENTENCE',
          issp: 'NO',
          hdc: 'YES',
          prarr: 'UNKNOWN',
        })
      })
    })

    it('should correctly submit the data to the CEMO API and move to the next selected page with a single checkbox selected', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/monitoring-conditions',
        response: mockEmptyMonitoringConditions.monitoringConditions,
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions`)
      const page = Page.verifyOnPage(MonitoringConditionsPage)

      const limitedValidFormData = {
        orderType: 'IMMIGRATION',
        orderTypeDescription: 'DAPOL',
        monitoringRequired: ['Alcohol monitoring'],
        conditionType: 'Requirement of a Community Order',
        startDate: new Date('2024-03-27T01:02:00Z'),
      }

      page.form.fillInWith(limitedValidFormData)
      page.form.saveAndContinueButton.click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          orderType: 'IMMIGRATION',
          orderTypeDescription: 'DAPOL',
          conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
          curfew: false,
          exclusionZone: false,
          trail: false,
          mandatoryAttendance: false,
          alcohol: true,
          startDate: '2024-03-27T01:02:00.000Z',
          endDate: null,
          sentenceType: null,
          issp: 'UNKNOWN',
          hdc: 'UNKNOWN',
          prarr: 'UNKNOWN',
        })
      })
      Page.verifyOnPage(InstallationAddressPage)
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions`, { failOnStatusCode: false })

      Page.verifyOnPage(ErrorPage, 'Not Found')
    })
  })
})
