import { v4 as uuidv4 } from 'uuid'
import { mockApiOrder } from '../../../mockApis/cemo'
import ErrorPage from '../../../pages/error'
import AlcoholMonitoringPage from '../../../pages/order/monitoring-conditions/alcohol-monitoring'
import Page from '../../../pages/page'
import InstallationLocationPage from '../../../pages/order/monitoring-conditions/installation-location'

const mockOrderId = uuidv4()

const mockInterestedParties = (notifyingOrg: string = 'PRISON') => {
  return {
    notifyingOrganisation: notifyingOrg,
    notifyingOrganisationName: '',
    notifyingOrganisationEmail: '',
    responsibleOfficerName: '',
    responsibleOfficerPhoneNumber: '',
    responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
    responsibleOrganisationEmail: '',
    responsibleOrganisationRegion: '',
  }
}

const mockSubmittedAlcoholMonitoring = {
  ...mockApiOrder('SUBMITTED'),
  interestedParties: mockInterestedParties(),
  monitoringConditionsAlcohol: {
    monitoringType: 'ALCOHOL_ABSTINENCE',
    startDate: '2024-03-27T00:00:00.000Z',
    endDate: '2025-04-28T00:00:00.000Z',
  },
  id: mockOrderId,
}

const mockEmptyAlcoholMonitoring = {
  ...mockApiOrder(),
  interestedParties: mockInterestedParties(),
  monitoringConditionsAlcohol: {
    monitoringType: null,
    startDate: null,
    endDate: null,
  },
  id: mockOrderId,
}

const mockCourtAlcoholMonitoring = {
  ...mockApiOrder(),
  interestedParties: mockInterestedParties('SCOTTISH_COURT'),
  monitoringConditionsAlcohol: {
    monitoringType: null,
    startDate: null,
    endDate: null,
  },
  id: mockOrderId,
}

context('Alcohol monitoring', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoListOrders')

    cy.signIn()
  })

  context('Draft order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockEmptyAlcoholMonitoring,
      })
    })

    it('Should display the form', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      page.header.userName().should('contain.text', 'J. Smith')
      page.errorSummary.shouldNotExist()
      page.form.shouldHaveAllOptions()
    })
  })

  context('Notifying org is court', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        order: mockCourtAlcoholMonitoring,
      })

      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/monitoring-conditions-alcohol',
        response: mockEmptyAlcoholMonitoring.monitoringConditionsAlcohol,
      })
    })

    it('should not show the monitoring type question', () => {
      const page = Page.visit(AlcoholMonitoringPage, { orderId: mockOrderId })

      cy.should('not.contain.value', 'What alcohol monitoring does the device wearer need?')

      page.form.fillInWith({
        startDate: new Date('2024-03-27T00:00:00.000Z'),
        endDate: new Date('2025-04-28T00:00:00.000Z'),
      })

      page.form.saveAndContinueButton.click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions-alcohol`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          monitoringType: 'ALCOHOL_ABSTINENCE',
          startDate: '2024-03-27T00:00:00.000Z',
          endDate: '2025-04-28T22:59:00.000Z',
        })
      })
      Page.verifyOnPage(InstallationLocationPage)
    })
  })

  context('Submitted Order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: mockSubmittedAlcoholMonitoring,
      })
    })

    it('Should correctly display the submitted data in disabled fields (probation office)', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: mockSubmittedAlcoholMonitoring,
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      page.submittedBanner.should('contain', 'You are viewing a submitted order.')
      page.form.shouldBeDisabled()
      page.errorSummary.shouldNotExist()
      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAndContinueButton.should('not.exist')
      page.backButton.should('exist').should('have.attr', 'href', '#')
    })

    it('Should correctly display the submitted data in disabled fields (prison)', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: mockSubmittedAlcoholMonitoring,
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      page.submittedBanner.should('contain', 'You are viewing a submitted order.')
      page.form.shouldBeDisabled()
      page.errorSummary.shouldNotExist()
      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAndContinueButton.should('not.exist')
      page.backButton.should('exist').should('have.attr', 'href', '#')
    })
  })

  context('Unsubmitted Order', () => {
    it('Should correctly display the submitted data in fields (probation office)', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          monitoringConditionsAlcohol: mockSubmittedAlcoholMonitoring.monitoringConditionsAlcohol,
        },
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      cy.root().should('not.contain', 'You are viewing a submitted order.')
      page.errorSummary.shouldNotExist()
      page.form.saveAndContinueButton.should('exist')
      page.form.saveAndContinueButton.should('exist')
    })

    it('Should correctly display the submitted data in fields (prison)', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          monitoringConditionsAlcohol: mockSubmittedAlcoholMonitoring.monitoringConditionsAlcohol,
        },
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      cy.root().should('not.contain', 'You are viewing a submitted order.')
      page.errorSummary.shouldNotExist()
      page.form.saveAndContinueButton.should('exist')
      page.form.saveAndContinueButton.should('exist')
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

    context('Submitting an invalid order', () => {
      it('should show errors when empty form is submitted', () => {
        cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
        const page = Page.verifyOnPage(AlcoholMonitoringPage)
        page.form.saveAndContinueButton.click()
        page.form.monitoringTypeField.shouldHaveValidationMessage(
          'Select what alcohol monitoring the device wearer needs',
        )
        page.form.startDateField.shouldHaveValidationMessage('Enter start date for alcohol monitoring')
        page.form.endDateField.shouldHaveValidationMessage('Enter end date for alcohol monitoring')

        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Select what alcohol monitoring the device wearer needs')
        page.errorSummary.shouldHaveError('Enter start date for alcohol monitoring')
        page.errorSummary.shouldHaveError('Enter end date for alcohol monitoring')
      })

      const setBaseRequest = (page: AlcoholMonitoringPage) => {
        page.form.monitoringTypeField.set('Alcohol level')
        page.form.startDateField.set(new Date(baseExpectedApiRequest.startDate), false)
        page.form.endDateField.set(new Date(baseExpectedApiRequest.endDate), false)
      }

      it('should show an error when startDate is provided in the wrong format', () => {
        cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
        const page = Page.verifyOnPage(AlcoholMonitoringPage)
        setBaseRequest(page)
        page.form.startDateField.setYear('text')
        page.form.saveAndContinueButton.click()
        page.form.startDateField.shouldHaveValidationMessage('Year must include 4 numbers')
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Year must include 4 numbers')
      })

      it('should show an error when endDate is provided in the wrong format', () => {
        cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
        const page = Page.verifyOnPage(AlcoholMonitoringPage)
        setBaseRequest(page)
        page.form.endDateField.setYear('text')
        page.form.saveAndContinueButton.click()
        page.form.endDateField.shouldHaveValidationMessage('Year must include 4 numbers')
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Year must include 4 numbers')
      })
    })

    const baseExpectedApiRequest = {
      monitoringType: 'ALCOHOL_ABSTINENCE',
      startDate: '2024-03-27T00:00:00.000Z',
      endDate: '2025-04-28T22:59:00.000Z',
    }

    it('should correctly submit the data to the CEMO API and move to the next page', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/monitoring-conditions-alcohol',
        response: mockEmptyAlcoholMonitoring.monitoringConditionsAlcohol,
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      page.fillInForm()
      page.form.saveAndContinueButton.click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions-alcohol`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal(baseExpectedApiRequest)
      })
      Page.verifyOnPage(InstallationLocationPage)
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`, { failOnStatusCode: false })

      Page.verifyOnPage(ErrorPage, 'Page not found')
    })
  })
})
