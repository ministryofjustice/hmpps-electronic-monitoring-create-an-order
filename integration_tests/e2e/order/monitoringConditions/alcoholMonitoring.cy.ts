import { v4 as uuidv4 } from 'uuid'
import { mockApiOrder } from '../../../mockApis/cemo'
import ErrorPage from '../../../pages/error'
import AlcoholMonitoringPage from '../../../pages/order/alcoholMonitoring'
import OrderTasksPage from '../../../pages/order/summary'
import Page from '../../../pages/page'

const mockOrderId = uuidv4()

const mockSubmittedAlcoholMonitoring = {
  ...mockApiOrder('SUBMITTED'),
  monitoringConditionsAlcohol: {
    monitoringType: 'ALCOHOL_ABSTINENCE',
    startDate: '2024-03-27T00:00:00.000Z',
    endDate: '2025-04-28T00:00:00.000Z',
    installationLocation: 'AGREED_LOCATION',
    installationName: 'Installation Name',
    agreedAddressLine1: '19 Strawberry Fields',
    agreedAddressLine2: 'Liverpool',
    agreedAddressLine3: 'Line 3',
    agreedAddressLine4: 'Line 4',
    agreedAddressPostcode: 'LV3 4DG',
    probationName: 'Probation Name',
    prisonName: 'Prison Name',
  },
  id: mockOrderId,
}

const mockEmptyAlcoholMonitoring = {
  ...mockApiOrder(),
  monitoringConditionsAlcohol: {
    monitoringType: null,
    startDate: null,
    endDate: null,
    installationLocation: null,
    installationName: null,
    agreedAddressLine1: null,
    agreedAddressLine2: null,
    agreedAddressLine3: null,
    agreedAddressLine4: null,
    agreedAddressPostcode: null,
    probationName: null,
    prisonName: null,
  },
  id: mockOrderId,
}

const mockInProgressAlcoholMonitoring = {
  ...mockSubmittedAlcoholMonitoring,
  status: 'IN_PROGRESS',
}

context('Alcohol monitoring', () => {
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
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      page.subHeader().should('contain.text', 'Alcohol monitoring')
      page.header.userName().should('contain.text', 'J. Smith')
    })
  })

  context('Submitted Order', () => {
    it('Should correctly display the submitted data in disabled fields (agreed location)', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: mockSubmittedAlcoholMonitoring,
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      page.submittedBanner().should('contain', 'You are viewing a submitted order.')
      cy.get('input[type="radio"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      cy.get('input[type="text"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      cy.get('input[type="radio"][value="AGREED_LOCATION"]').should('be.checked')
      cy.get('input[name="agreedAddressLine1"]').should('have.value', '19 Strawberry Fields')
      cy.get('input[name="agreedAddressLine2"]').should('have.value', 'Liverpool')
      cy.get('input[name="agreedAddressLine3"]').should('have.value', 'Line 3')
      cy.get('input[name="agreedAddressLine4"]').should('have.value', 'Line 4')
      cy.get('input[name="agreedAddressPostcode"]').should('have.value', 'LV3 4DG')
      page.saveAndContinueButton().should('not.exist')
      page.saveAndReturnButton().should('not.exist')
      page.backToSummaryButton().should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)
    })

    it('Should correctly display the submitted data in disabled fields (probation office)', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          monitoringConditionsAlcohol: {
            ...mockSubmittedAlcoholMonitoring.monitoringConditionsAlcohol,
            installationLocation: 'PROBATION_OFFICE',
          },
        },
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      page.submittedBanner().should('contain', 'You are viewing a submitted order.')
      cy.get('input[type="radio"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      cy.get('input[type="text"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      cy.get('input[type="radio"][value="PROBATION_OFFICE"]').should('be.checked')
      cy.get('input[name="probationName"]').should('have.value', 'Probation Name')
      page.saveAndContinueButton().should('not.exist')
      page.saveAndReturnButton().should('not.exist')
      page.backToSummaryButton().should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)
    })

    it('Should correctly display the submitted data in disabled fields (prison)', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          monitoringConditionsAlcohol: {
            ...mockSubmittedAlcoholMonitoring.monitoringConditionsAlcohol,
            installationLocation: 'PRISON',
          },
        },
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      page.submittedBanner().should('contain', 'You are viewing a submitted order.')
      cy.get('input[type="radio"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      cy.get('input[type="text"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      cy.get('input[type="radio"][value="PRISON"]').should('be.checked')
      cy.get('input[name="prisonName"]').should('have.value', 'Prison Name')
      page.saveAndContinueButton().should('not.exist')
      page.saveAndReturnButton().should('not.exist')
      page.backToSummaryButton().should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)
    })
  })

  context('Unsubmitted Order', () => {
    it('Should correctly display the data in enabled fields (agreed location)', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockInProgressAlcoholMonitoring,
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      cy.root().should('not.contain', 'You are viewing a submitted order.')
      cy.get('input[type="radio"]').each($el => {
        cy.wrap($el).should('not.be.disabled')
      })
      cy.get('input[type="text"]').each($el => {
        cy.wrap($el).should('not.be.disabled')
      })
      cy.get('input[type="radio"][value="AGREED_LOCATION"]').should('be.checked')
      cy.get('input[name="agreedAddressLine1"]').should('have.value', '19 Strawberry Fields')
      cy.get('input[name="agreedAddressLine2"]').should('have.value', 'Liverpool')
      cy.get('input[name="agreedAddressLine3"]').should('have.value', 'Line 3')
      cy.get('input[name="agreedAddressLine4"]').should('have.value', 'Line 4')
      cy.get('input[name="agreedAddressPostcode"]').should('have.value', 'LV3 4DG')
      page.saveAndContinueButton().should('exist')
      page.saveAndReturnButton().should('exist')
    })

    it('Should correctly display the submitted data in disabled fields (probation office)', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          monitoringConditionsAlcohol: {
            ...mockSubmittedAlcoholMonitoring.monitoringConditionsAlcohol,
            installationLocation: 'PROBATION_OFFICE',
          },
        },
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      cy.root().should('not.contain', 'You are viewing a submitted order.')
      cy.get('input[type="radio"]').each($el => {
        cy.wrap($el).should('not.be.disabled')
      })
      cy.get('input[type="text"]').each($el => {
        cy.wrap($el).should('not.be.disabled')
      })
      cy.get('input[type="radio"][value="PROBATION_OFFICE"]').should('be.checked')
      cy.get('input[name="probationName"]').should('have.value', 'Probation Name')
      page.saveAndContinueButton().should('exist')
      page.saveAndReturnButton().should('exist')
    })

    it('Should correctly display the submitted data in disabled fields (prison)', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          monitoringConditionsAlcohol: {
            ...mockSubmittedAlcoholMonitoring.monitoringConditionsAlcohol,
            installationLocation: 'PRISON',
          },
        },
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      cy.root().should('not.contain', 'You are viewing a submitted order.')
      cy.get('input[type="radio"]').each($el => {
        cy.wrap($el).should('not.be.disabled')
      })
      cy.get('input[type="text"]').each($el => {
        cy.wrap($el).should('not.be.disabled')
      })
      cy.get('input[type="radio"][value="PRISON"]').should('be.checked')
      cy.get('input[name="prisonName"]').should('have.value', 'Prison Name')
      page.saveAndContinueButton().should('exist')
      page.saveAndReturnButton().should('exist')
    })
  })

  context('Submitting the form', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockEmptyAlcoholMonitoring,
      })
    })

    it('should show errors with agreed location selected', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 400,
        id: mockOrderId,
        subPath: '/monitoring-conditions-alcohol',
        response: [
          { field: 'monitoringType', error: 'You must select an option' },
          { field: 'startDate', error: 'You must enter a valid date' },
          { field: 'endDate', error: 'You must enter a valid date' },
          { field: 'installationLocation', error: 'You must select an option' },
          { field: 'agreedAddress', error: 'You must enter a valid address' },
        ],
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      cy.get('input[type="radio"][value="AGREED_LOCATION"]').check()
      page.saveAndContinueButton().click()
      cy.get('#monitoringType-error').should('contain', 'You must select an option')
      cy.get('#startDate-error').should('contain', 'You must enter a valid date')
      cy.get('#endDate-error').should('contain', 'You must enter a valid date')
      cy.get('#installationLocation-error').should('contain', 'You must select an option')
      cy.get('#agreedAddress-error').should('contain', 'You must enter a valid address')
    })

    it('should show errors with probation office selected', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 400,
        id: mockOrderId,
        subPath: '/monitoring-conditions-alcohol',
        response: [
          { field: 'monitoringType', error: 'You must select an option' },
          { field: 'startDate', error: 'You must enter a valid date' },
          { field: 'endDate', error: 'You must enter a valid date' },
          { field: 'installationLocation', error: 'You must select an option' },
          { field: 'probationName', error: 'You must enter a valid name' },
        ],
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      cy.get('input[type="radio"][value="PROBATION_OFFICE"]').check()
      page.saveAndContinueButton().click()
      cy.get('#monitoringType-error').should('contain', 'You must select an option')
      cy.get('#startDate-error').should('contain', 'You must enter a valid date')
      cy.get('#endDate-error').should('contain', 'You must enter a valid date')
      cy.get('#installationLocation-error').should('contain', 'You must select an option')
      cy.get('#probationName-error').should('contain', 'You must enter a valid name')
    })

    it('should show errors with prison selected', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 400,
        id: mockOrderId,
        subPath: '/monitoring-conditions-alcohol',
        response: [
          { field: 'monitoringType', error: 'You must select an option' },
          { field: 'startDate', error: 'You must enter a valid date' },
          { field: 'endDate', error: 'You must enter a valid date' },
          { field: 'installationLocation', error: 'You must select an option' },
          { field: 'prisonName', error: 'You must enter a valid name' },
        ],
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      cy.get('input[type="radio"][value="PRISON"]').check()
      page.saveAndContinueButton().click()
      cy.get('#monitoringType-error').should('contain', 'You must select an option')
      cy.get('#startDate-error').should('contain', 'You must enter a valid date')
      cy.get('#endDate-error').should('contain', 'You must enter a valid date')
      cy.get('#installationLocation-error').should('contain', 'You must select an option')
      cy.get('#prisonName-error').should('contain', 'You must enter a valid name')
    })

    const baseExpectedApiRequest = {
      monitoringType: 'ALCOHOL_ABSTINENCE',
      startDate: '2024-03-27T00:00:00.000Z',
      endDate: '2025-04-28T00:00:00.000Z',
      installationLocation: null,
      agreedAddressLine1: null,
      agreedAddressLine2: null,
      agreedAddressLine3: null,
      agreedAddressLine4: null,
      agreedAddressPostcode: null,
      prisonName: null,
      probationName: null,
    }

    it('should correctly submit the data to the CEMO API and move to the next page (agreed location)', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/monitoring-conditions-alcohol',
        response: mockEmptyAlcoholMonitoring.monitoringConditionsAlcohol,
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      page.fillInForm('agreedLocation')
      page.saveAndContinueButton().click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions-alcohol`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          ...baseExpectedApiRequest,
          installationLocation: 'AGREED_LOCATION',
          agreedAddressLine1: 'Address line 1',
          agreedAddressLine2: 'Address line 2',
          agreedAddressLine3: 'Address line 3',
          agreedAddressLine4: 'Address line 4',
          agreedAddressPostcode: 'Postcode',
        })
      })
      Page.verifyOnPage(OrderTasksPage)
    })

    it('should correctly submit the data to the CEMO API and move to the next page (probation office)', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/monitoring-conditions-alcohol',
        response: mockEmptyAlcoholMonitoring.monitoringConditionsAlcohol,
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      page.fillInForm('probationOffice')
      page.saveAndContinueButton().click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions-alcohol`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          ...baseExpectedApiRequest,
          installationLocation: 'PROBATION_OFFICE',
          probationName: 'Probation Office',
        })
      })
      Page.verifyOnPage(OrderTasksPage)
    })

    it('should correctly submit the data to the CEMO API and move to the next page (prison)', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/monitoring-conditions-alcohol',
        response: mockEmptyAlcoholMonitoring.monitoringConditionsAlcohol,
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      page.fillInForm('prison')
      page.saveAndContinueButton().click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions-alcohol`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          ...baseExpectedApiRequest,
          installationLocation: 'PRISON',
          prisonName: 'Prison Name',
        })
      })
      Page.verifyOnPage(OrderTasksPage)
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`, { failOnStatusCode: false })

      Page.verifyOnPage(ErrorPage, 'Not Found')
    })
  })
})
