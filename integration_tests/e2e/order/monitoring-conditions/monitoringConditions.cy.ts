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
    acquisitiveCrime: true,
    dapol: true,
    curfew: true,
    exclusionZone: true,
    trail: true,
    mandatoryAttendance: true,
    alcohol: true,
    startDate: '2024-10-10T00:00:00.000Z',
    endDate: '2024-10-11T00:00:00.000Z',
  },
}
const mockEmptyMonitoringConditions = {
  monitoringConditions: {
    orderType: null,
    orderTypeDescription: null,
    conditionType: null,
    acquisitiveCrime: null,
    dapol: null,
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
      cy.get('input[type="radio"][value="true"]').each($el => {
        cy.wrap($el).should('be.checked').and('be.disabled')
      })
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

    it('should show errors with an empty form submission', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 400,
        id: mockOrderId,
        subPath: '/monitoring-conditions',
        response: [
          { field: 'acquisitiveCrime', error: 'You must select an option' },
          { field: 'dapol', error: 'You must select an option' },
          { field: 'orderType', error: 'You must select an option' },
          { field: 'orderTypeDescription', error: 'You must select an option' },
          { field: 'conditionType', error: 'You must select an option' },
          { field: 'updateMonitoringConditionsDto', error: 'You must select an option' },
          { field: 'startDate', error: 'You must select an option' },
          { field: 'endDate', error: 'You must select an option' },
        ],
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions`)
      const page = Page.verifyOnPage(MonitoringConditionsPage)
      cy.get('input[type="radio"]').should('not.be.checked')
      cy.get('input[type="checkbox"]').should('not.be.checked')
      cy.get('select[name="orderType"]').invoke('val').should('deep.equal', '')
      page.form.saveAndContinueButton.click()
      cy.get('#acquisitiveCrime-error').should('contain', 'You must select an option')
      cy.get('#dapol-error').should('contain', 'You must select an option')
      cy.get('#orderType-error').should('contain', 'You must select an option')
      cy.get('#orderTypeDescription-error').should('contain', 'You must select an option')
      cy.get('#conditionType-error').should('contain', 'You must select an option')
      cy.get('#monitoringRequired-error').should('contain', 'You must select an option')
      cy.get('#startDate-error').should('contain', 'You must select an option')
      cy.get('#endDate-error').should('contain', 'You must select an option')
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
      cy.get('input[type="radio"][value="true"]').check()
      cy.get('input[type="checkbox"]').check()
      cy.get('select[name="orderType"]').select('immigration')
      cy.get('select[name="orderTypeDescription"]').select('GPS Acquisitive Crime HDC')
      cy.get('select[name="conditionType"]').select('License Condition of a Custodial Order')
      cy.get('#startDate-startDay').type('27')
      cy.get('#startDate-startMonth').type('3')
      cy.get('#startDate-startYear').type('2024')
      cy.get('#endDate-endDay').type('28')
      cy.get('#endDate-endMonth').type('4')
      cy.get('#endDate-endYear').type('2025')
      page.form.saveAndContinueButton.click()
      Page.verifyOnPage(InstallationAddressPage)
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          acquisitiveCrime: true,
          dapol: true,
          orderType: 'immigration',
          orderTypeDescription: 'GPS_ACQUISITIVE_CRIME_HDC',
          conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
          curfew: true,
          exclusionZone: true,
          trail: true,
          mandatoryAttendance: true,
          alcohol: true,
          startDate: '2024-03-27T00:00:00.000Z',
          endDate: '2025-04-28T00:00:00.000Z',
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
      cy.get('input[type="radio"][value="true"]').check()
      cy.get('input[type="checkbox"][value="alcohol"]').check()
      cy.get('select[name="orderType"]').select('immigration')
      cy.get('select[name="orderTypeDescription"]').select('DAPOL')
      cy.get('select[name="conditionType"]').select('Requirement of a Community Order')
      cy.get('#startDate-startDay').type('27')
      cy.get('#startDate-startMonth').type('3')
      cy.get('#startDate-startYear').type('2024')
      page.form.saveAndContinueButton.click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          acquisitiveCrime: true,
          dapol: true,
          orderType: 'immigration',
          orderTypeDescription: 'DAPOL',
          conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
          curfew: false,
          exclusionZone: false,
          trail: false,
          mandatoryAttendance: false,
          alcohol: true,
          startDate: '2024-03-27T00:00:00.000Z',
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
