import { v4 as uuidv4 } from 'uuid'
import ErrorPage from '../../../pages/error'
import MonitoringConditionsPage from '../../../pages/order/monitoring-conditions'
import Page from '../../../pages/page'
import InstallationAddressPage from '../../../pages/order/monitoring-conditions/installation-address'

const mockSubmittedMonitoringRequirements = {
  monitoringConditions: {
    orderType: 'immigration',
    orderTypeDescription: 'DAPOL',
    conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
    curfew: true,
    exclusionZone: true,
    trail: true,
    mandatoryAttendance: true,
    alcohol: true,
    startDate: '2024-10-10T11:00:00.000Z',
    endDate: '2024-10-11T11:00:00.000Z',
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
  },
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
      cy.get('input[type="checkbox"]').each($el => {
        cy.wrap($el).should('be.checked').and('be.disabled')
      })
      cy.get('select[name="orderType"]').invoke('val').should('deep.equal', 'immigration')
      cy.get('select[name="orderType"]').should('be.disabled')
      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAndReturnButton.should('not.exist')
      page.backToSummaryButton.should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)
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
      cy.get('#orderType-error').should('contain', 'Order type is required')
      cy.get('#conditionType-error').should('contain', 'Condition type is required')
      cy.get('#monitoringRequired-error').should('contain', 'At least one monitoring type must be selected')
      cy.get('#startDate-error').should('contain', 'Order start date and time are required')
    })

    it('after frontend validation passses, should show errors from API response', () => {
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
      cy.get('input[type="checkbox"]').check()
      cy.get('select[name="orderType"]').select('immigration')
      cy.get('select[name="orderTypeDescription"]').select('GPS Acquisitive Crime HDC')
      cy.get('select[name="conditionType"]').select('License Condition of a Custodial Order')
      cy.get('#startDate-day').type('27')
      cy.get('#startDate-month').type('3')
      cy.get('#startDate-year').type('2024')
      cy.get('#startDate-hours').type('01')
      cy.get('#startDate-minutes').type('02')
      cy.get('#endDate-day').type('28')
      cy.get('#endDate-month').type('4')
      cy.get('#endDate-year').type('2025')
      cy.get('#endDate-hours').type('03')
      cy.get('#endDate-minutes').type('04')
      page.form.saveAndContinueButton.click()
      cy.get('#orderType-error').should('contain', 'Test error - order type')
      cy.get('#orderTypeDescription-error').should('contain', 'Test error - order type description')
      cy.get('#conditionType-error').should('contain', 'Test error - condition type')
      cy.get('#monitoringRequired-error').should('contain', 'Test error - monitoring required')
      cy.get('#startDate-error').should('contain', 'Test error - start date')
      cy.get('#endDate-error').should('contain', 'Test error - end date')
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
      cy.get('input[type="checkbox"]').check()
      cy.get('select[name="orderType"]').select('immigration')
      cy.get('select[name="orderTypeDescription"]').select('GPS Acquisitive Crime HDC')
      cy.get('select[name="conditionType"]').select('License Condition of a Custodial Order')
      cy.get('#startDate-day').type('27')
      cy.get('#startDate-month').type('3')
      cy.get('#startDate-year').type('2024')
      cy.get('#startDate-hours').type('01')
      cy.get('#startDate-minutes').type('02')
      cy.get('#endDate-day').type('28')
      cy.get('#endDate-month').type('4')
      cy.get('#endDate-year').type('2025')
      cy.get('#endDate-hours').type('03')
      cy.get('#endDate-minutes').type('04')
      page.form.saveAndContinueButton.click()
      Page.verifyOnPage(InstallationAddressPage)
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          orderType: 'immigration',
          orderTypeDescription: 'GPS_ACQUISITIVE_CRIME_HDC',
          conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
          curfew: true,
          exclusionZone: true,
          trail: true,
          mandatoryAttendance: true,
          alcohol: true,
          startDate: '2024-03-27T01:02:00.000Z',
          endDate: '2025-04-28T03:04:00.000Z',
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
      cy.get('input[type="checkbox"][value="alcohol"]').check()
      cy.get('select[name="orderType"]').select('immigration')
      cy.get('select[name="orderTypeDescription"]').select('DAPOL')
      cy.get('select[name="conditionType"]').select('Requirement of a Community Order')
      cy.get('#startDate-day').type('27')
      cy.get('#startDate-month').type('3')
      cy.get('#startDate-year').type('2024')
      cy.get('#startDate-hours').type('01')
      cy.get('#startDate-minutes').type('02')
      page.form.saveAndContinueButton.click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          orderType: 'immigration',
          orderTypeDescription: 'DAPOL',
          conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
          curfew: false,
          exclusionZone: false,
          trail: false,
          mandatoryAttendance: false,
          alcohol: true,
          startDate: '2024-03-27T01:02:00.000Z',
          endDate: null,
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
