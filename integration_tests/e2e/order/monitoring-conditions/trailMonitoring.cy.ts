import { v4 as uuidv4 } from 'uuid'
import { NotFoundErrorPage } from '../../../pages/error'
import AlcoholMonitoringPage from '../../../pages/order/monitoring-conditions/alcohol-monitoring'
import TrailMonitoringPage from '../../../pages/order/monitoring-conditions/trail-monitoring'
import Page from '../../../pages/page'

const mockOrderId = uuidv4()

const mockEmptyTrailMonitoring = {
  monitoringConditionsTrail: {
    startDate: null,
    endDate: null,
  },
  monitoringConditions: {
    orderType: 'IMMIGRATION',
    orderTypeDescription: null,
    conditionType: null,
    acquisitiveCrime: true,
    dapol: true,
    curfew: false,
    exclusionZone: false,
    trail: true,
    mandatoryAttendance: false,
    alcohol: true,
    startDate: null,
    endDate: null,
    sentenceType: null,
    issp: null,
    hdc: null,
    prarr: null,
  },
}

const mockSubmittedTrailMonitoring = {
  monitoringConditionsTrail: {
    startDate: '2024-03-27T00:00:00.000Z',
    endDate: '2025-04-28T00:00:00.000Z',
  },
  monitoringConditions: {
    orderType: 'IMMIGRATION',
    orderTypeDescription: null,
    conditionType: null,
    acquisitiveCrime: true,
    dapol: true,
    curfew: true,
    exclusionZone: true,
    trail: true,
    mandatoryAttendance: true,
    alcohol: true,
    startDate: null,
    endDate: null,
    sentenceType: null,
    issp: null,
    hdc: null,
    prarr: null,
  },
}

context('Trail monitoring', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
  })

  context('Draft order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockEmptyTrailMonitoring,
      })
    })

    it('Should display the form', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/trail`)
      const page = Page.verifyOnPage(TrailMonitoringPage)
      page.header.userName().should('contain.text', 'J. Smith')
    })
  })

  context('Submitted Order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: mockSubmittedTrailMonitoring,
      })
    })

    it('Should correctly display the submitted data in disabled fields', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/trail`)
      const page = Page.verifyOnPage(TrailMonitoringPage)
      page.submittedBanner.should('contain', 'You are viewing a submitted order.')
      cy.get('input[type="text"]').should('be.disabled')
      cy.get('input[type="text"]').should('be.disabled')
      cy.get('#startDate-day').invoke('val').should('equal', '27')
      cy.get('#startDate-month').invoke('val').should('equal', '3')
      cy.get('#startDate-year').invoke('val').should('equal', '2024')
      cy.get('#endDate-day').invoke('val').should('equal', '28')
      cy.get('#endDate-month').invoke('val').should('equal', '4')
      cy.get('#endDate-year').invoke('val').should('equal', '2025')
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
        order: mockEmptyTrailMonitoring,
      })
    })

    context('Submitting an invalid order', () => {
      it('should show errors with an empty form submission', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: '/monitoring-conditions-trail',
          response: [
            { field: 'startDate', error: 'You must enter a valid date' },
            { field: 'endDate', error: 'You must enter a valid date' },
          ],
        })
        cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/trail`)
        const page = Page.verifyOnPage(TrailMonitoringPage)
        page.form.saveAndContinueButton.click()
        cy.get('#startDate-error').should('contain', 'You must enter a valid date')
        cy.get('#endDate-error').should('contain', 'You must enter a valid date')
      })

      it('should show an error when startDate is provided in the wrong format', () => {
        cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/trail`)
        const page = Page.verifyOnPage(TrailMonitoringPage)
        cy.get('#startDate-day').type('text')
        page.form.saveAndContinueButton.click()
        cy.get('#startDate-error').should(
          'contain',
          'Date is in an incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.',
        )
      })

      it('should show an error when endDate is provided in the wrong format', () => {
        cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/trail`)
        const page = Page.verifyOnPage(TrailMonitoringPage)
        cy.get('#endDate-month').type('text')
        page.form.saveAndContinueButton.click()
        cy.get('#endDate-error').should(
          'contain',
          'Date is in an incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.',
        )
      })
    })

    it('should correctly submit the data to the CEMO API and move to the next selected page', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/monitoring-conditions-trail',
        response: mockSubmittedTrailMonitoring.monitoringConditionsTrail,
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/trail`)
      const page = Page.verifyOnPage(TrailMonitoringPage)
      cy.get('#startDate-day').type('27')
      cy.get('#startDate-month').type('3')
      cy.get('#startDate-year').type('2024')
      cy.get('#endDate-day').type('28')
      cy.get('#endDate-month').type('4')
      cy.get('#endDate-year').type('2025')
      page.form.saveAndContinueButton.click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions-trail`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          startDate: '2024-03-27T00:00:00.000Z',
          endDate: '2025-04-28T00:00:00.000Z',
        })
      })

      Page.verifyOnPage(AlcoholMonitoringPage)
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/trail`, { failOnStatusCode: false })

      Page.verifyOnPage(NotFoundErrorPage)
    })
  })
})
