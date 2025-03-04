import { v4 as uuidv4 } from 'uuid'
import { mockApiOrder } from '../../../mockApis/cemo'
import ErrorPage from '../../../pages/error'
import AlcoholMonitoringPage from '../../../pages/order/monitoring-conditions/alcohol-monitoring'
import Page from '../../../pages/page'
import MonitoringConditionsCheckYourAnswersPage from '../../../pages/order/monitoring-conditions/check-your-answers'

const mockOrderId = uuidv4()

const mockSubmittedAlcoholMonitoring = {
  ...mockApiOrder('SUBMITTED'),
  monitoringConditionsAlcohol: {
    monitoringType: 'ALCOHOL_ABSTINENCE',
    startDate: '2024-03-27T00:00:00.000Z',
    endDate: '2025-04-28T00:00:00.000Z',
    installationLocation: 'INSTALLATION',
    probationOfficeName: null,
    prisonName: null,
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
    prisonName: null,
    probationOfficeName: null,
  },
  id: mockOrderId,
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
        order: mockSubmittedAlcoholMonitoring,
      })
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
            probationOfficeName: 'Probation Office',
          },
        },
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      page.submittedBanner.should('contain', 'You are viewing a submitted order.')
      page.form.shouldBeDisabled()
      page.errorSummary.shouldNotExist()
      page.form.installLocationField.shouldHaveValue('at the probation office')
      page.form.probationNameField.shouldHaveValue('Probation Office')
      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAndContinueButton.should('not.exist')
      page.backToSummaryButton.should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)
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
            prisonName: 'Prison Name',
          },
        },
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      page.submittedBanner.should('contain', 'You are viewing a submitted order.')
      page.form.shouldBeDisabled()
      page.errorSummary.shouldNotExist()
      page.form.installLocationField.shouldHaveValue('at prison')
      page.form.prisonNameField.shouldHaveValue('Prison Name')
      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAndContinueButton.should('not.exist')
      page.backToSummaryButton.should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)
    })
  })

  context('Unsubmitted Order', () => {
    it('Should correctly display the submitted data in fields (probation office)', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          monitoringConditionsAlcohol: {
            ...mockSubmittedAlcoholMonitoring.monitoringConditionsAlcohol,
            installationLocation: 'PROBATION_OFFICE',
            probationOfficeName: 'Probation Office',
          },
        },
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      cy.root().should('not.contain', 'You are viewing a submitted order.')
      page.errorSummary.shouldNotExist()
      page.form.installLocationField.shouldHaveValue('at the probation office')
      page.form.probationNameField.shouldHaveValue('Probation Office')
      page.form.saveAndContinueButton.should('exist')
      page.form.saveAndContinueButton.should('exist')
    })

    it('Should correctly display the submitted data in fields (prison)', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          monitoringConditionsAlcohol: {
            ...mockSubmittedAlcoholMonitoring.monitoringConditionsAlcohol,
            installationLocation: 'PRISON',
            prisonName: 'Prison Name',
          },
        },
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      cy.root().should('not.contain', 'You are viewing a submitted order.')
      page.errorSummary.shouldNotExist()
      page.form.installLocationField.shouldHaveValue('at prison')
      page.form.prisonNameField.shouldHaveValue('Prison Name')
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
      it('should show errors with probation office selected', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: '/monitoring-conditions-alcohol',
          response: [
            { field: 'monitoringType', error: 'Monitoring type is required' },
            { field: 'startDate', error: 'Start date is required' },
            { field: 'endDate', error: 'End date is required' },
            { field: 'installationLocation', error: 'Installation location is required' },
            {
              field: 'probationOfficeName',
              error: 'You must enter a probation office name if the installation location is a probation office',
            },
          ],
        })
        cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
        const page = Page.verifyOnPage(AlcoholMonitoringPage)
        cy.get('input[type="radio"][value="PROBATION_OFFICE"]').check()
        page.form.saveAndContinueButton.click()
        page.form.monitoringTypeField.shouldHaveValidationMessage('Monitoring type is required')
        page.form.startDateField.shouldHaveValidationMessage('Start date is required')
        page.form.endDateField.shouldHaveValidationMessage('End date is required')
        page.form.installLocationField.shouldHaveValidationMessage('Installation location is required')
        page.form.probationNameField.shouldHaveValidationMessage(
          'You must enter a probation office name if the installation location is a probation office',
        )
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Monitoring type is required')
        page.errorSummary.shouldHaveError('Start date is required')
        page.errorSummary.shouldHaveError('End date is required')
        page.errorSummary.shouldHaveError('Installation location is required')
        page.errorSummary.shouldHaveError(
          'You must enter a probation office name if the installation location is a probation office',
        )
      })

      it('should show errors with prison selected', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: '/monitoring-conditions-alcohol',
          response: [
            { field: 'monitoringType', error: 'Monitoring type is required' },
            { field: 'startDate', error: 'Start date is required' },
            { field: 'endDate', error: 'End date is required' },
            { field: 'installationLocation', error: 'Installation location is required' },
            { field: 'prisonName', error: 'You must enter a prison name if the installation location is a prison' },
          ],
        })
        cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
        const page = Page.verifyOnPage(AlcoholMonitoringPage)
        cy.get('input[type="radio"][value="PRISON"]').check()
        page.form.saveAndContinueButton.click()
        page.form.saveAndContinueButton.click()
        page.form.monitoringTypeField.shouldHaveValidationMessage('Monitoring type is required')
        page.form.startDateField.shouldHaveValidationMessage('Start date is required')
        page.form.endDateField.shouldHaveValidationMessage('End date is required')
        page.form.installLocationField.shouldHaveValidationMessage('Installation location is required')
        page.form.prisonNameField.shouldHaveValidationMessage(
          'You must enter a prison name if the installation location is a prison',
        )
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Monitoring type is required')
        page.errorSummary.shouldHaveError('Start date is required')
        page.errorSummary.shouldHaveError('End date is required')
        page.errorSummary.shouldHaveError('Installation location is required')
        page.errorSummary.shouldHaveError('You must enter a prison name if the installation location is a prison')
      })

      it('should show an error when startDate is provided in the wrong format', () => {
        cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
        const page = Page.verifyOnPage(AlcoholMonitoringPage)
        cy.get('#startDate-day').type('text')
        page.form.saveAndContinueButton.click()
        page.form.startDateField.shouldHaveValidationMessage(
          'Date is in an incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.',
        )
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(
          'Date is in an incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.',
        )
      })

      it('should show an error when endDate is provided in the wrong format', () => {
        cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
        const page = Page.verifyOnPage(AlcoholMonitoringPage)
        cy.get('#endDate-year').type('text')
        page.form.saveAndContinueButton.click()
        page.form.endDateField.shouldHaveValidationMessage(
          'Date is in an incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.',
        )
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(
          'Date is in an incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.',
        )
      })
    })

    const baseExpectedApiRequest = {
      monitoringType: 'ALCOHOL_ABSTINENCE',
      startDate: '2024-03-27T00:00:00.000Z',
      endDate: '2025-04-28T00:00:00.000Z',
      installationLocation: null,
      prisonName: null,
      probationOfficeName: null,
    }

    it('should correctly submit the data to the CEMO API and move to the next page (probation office)', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/monitoring-conditions-alcohol',
        response: mockEmptyAlcoholMonitoring.monitoringConditionsAlcohol,
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/alcohol`)
      const page = Page.verifyOnPage(AlcoholMonitoringPage)
      page.fillInForm('at the probation office')
      page.form.saveAndContinueButton.click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions-alcohol`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          ...baseExpectedApiRequest,
          installationLocation: 'PROBATION_OFFICE',
          probationOfficeName: 'Probation Office',
        })
      })
      Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage)
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
      page.fillInForm('at prison')
      page.form.saveAndContinueButton.click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions-alcohol`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          ...baseExpectedApiRequest,
          installationLocation: 'PRISON',
          prisonName: 'Prison Name',
        })
      })
      Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage)
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
