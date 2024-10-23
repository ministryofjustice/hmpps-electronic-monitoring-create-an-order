import { v4 as uuidv4 } from 'uuid'
import ErrorPage from '../../../pages/error'
import MonitoringConditionsPage from '../../../pages/order/monitoringConditions'
import Page from '../../../pages/page'
import InstallationAddressPage from '../../../pages/order/monitoring-conditions/installation-address'

const mockSubmittedMonitoringRequirements = {
  monitoringConditions: {
    orderType: 'immigration',
    acquisitiveCrime: true,
    dapol: true,
    curfew: true,
    exclusionZone: true,
    trail: true,
    mandatoryAttendance: true,
    alcohol: true,
    devicesRequired: [
      'Location - fitted',
      'Location - non-fitted',
      'RF',
      'Alcohol (Transdermal)',
      'Alcohol (Remote Breath)',
    ],
  },
}
const mockEmptyMonitoringConditions = {
  monitoringConditions: {
    orderType: null,
    acquisitiveCrime: null,
    dapol: null,
    curfew: null,
    exclusionZone: null,
    trail: null,
    mandatoryAttendance: null,
    alcohol: null,
    devicesRequired: null,
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
      page.submittedBanner().should('contain', 'You are viewing a submitted order.')
      cy.get('input[type="radio"][value="true"]').each($el => {
        cy.wrap($el).should('be.checked').and('be.disabled')
      })
      cy.get('input[type="checkbox"]').each($el => {
        cy.wrap($el).should('be.checked').and('be.disabled')
      })
      cy.get('select[name="orderType"]').invoke('val').should('deep.equal', 'immigration')
      cy.get('select[name="orderType"]').should('be.disabled')
      page.saveAndContinueButton().should('not.exist')
      page.saveAndReturnButton().should('not.exist')
      page.backToSummaryButton().should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)
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
          { field: 'updateMonitoringConditionsDto', error: 'You must select an option' },
          { field: 'devicesRequired', error: 'You must select an option' },
        ],
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions`)
      const page = Page.verifyOnPage(MonitoringConditionsPage)
      cy.get('input[type="radio"]').should('not.be.checked')
      cy.get('input[type="checkbox"]').should('not.be.checked')
      cy.get('select[name="orderType"]').invoke('val').should('deep.equal', '')
      page.saveAndContinueButton().click()
      cy.get('#acquisitiveCrime-error').should('contain', 'You must select an option')
      cy.get('#dapol-error').should('contain', 'You must select an option')
      cy.get('#orderType-error').should('contain', 'You must select an option')
      cy.get('#monitoringRequired-error').should('contain', 'You must select an option')
      cy.get('#devicesRequired-error').should('contain', 'You must select an option')
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
      page.saveAndContinueButton().click()
      Page.verifyOnPage(InstallationAddressPage)
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          acquisitiveCrime: true,
          dapol: true,
          orderType: 'immigration',
          curfew: true,
          exclusionZone: true,
          trail: true,
          mandatoryAttendance: true,
          alcohol: true,
          devicesRequired: [
            'Location - fitted',
            'Location - non-fitted',
            'RF',
            'Alcohol (Transdermal)',
            'Alcohol (Remote Breath)',
          ],
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
      cy.get('input[type="checkbox"][value="Alcohol (Transdermal)"]').check()
      cy.get('select[name="orderType"]').select('immigration')
      page.saveAndContinueButton().click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          acquisitiveCrime: true,
          dapol: true,
          orderType: 'immigration',
          curfew: false,
          exclusionZone: false,
          trail: false,
          mandatoryAttendance: false,
          alcohol: true,
          devicesRequired: ['Alcohol (Transdermal)'],
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
