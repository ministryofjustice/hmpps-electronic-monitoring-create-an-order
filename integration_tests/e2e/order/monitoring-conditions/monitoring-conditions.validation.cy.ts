import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import MonitoringConditionsPage from '../../../pages/order/monitoring-conditions'

const mockOrderId = uuidv4()
const apiPath = '/monitoring-conditions'

const errorMessages = {
  conditionTypeRequired: 'Select order type condition',
  monitoringTypeRequired: 'Select monitoring required',
  pilotRequired: 'Select the type of pilot the device wearer is part of',
  startDateMustBeReal: 'Start date for monitoring must be a real date',
  startDateMustIncludeDay: 'Start date for monitoring must include a day',
  startDateMustIncludeMonth: 'Start date for monitoring must include a month',
  startDateMustIncludeYear: 'Start date for monitoring must include a year',
  startDateRequired: 'Enter start date for monitoring',
  endDateRequired: 'Enter end date for monitoring',
  yearMustIncludeFourNumbers: 'Year must include 4 numbers',
  sentenceTypeRequired: 'Select the type of sentence the device wearer has been given',
}

const validFormData = {
  monitoringRequired: ['Curfew', 'Exclusion zone monitoring', 'Trail monitoring', 'Mandatory attendance monitoring'],
  conditionType: 'Licence condition',
  startDate: new Date('2024-02-27T11:02:00Z'),
  endDate: new Date('2025-03-08T04:40:00Z'),
  sentenceType: 'Extended Determinate Sentence',
  issp: 'No',
  hdc: 'Yes',
  prarr: 'Not able to provide this information',
  pilot: 'GPS Acquisitive Crime',
}

context('Monitoring conditions', () => {
  context('Index', () => {
    context('Submitting invalid data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: { dataDictionaryVersion: 'DDV5' },
        })

        cy.signIn()
      })

      it('Should show the user validation errors', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: [],
        })

        const page = Page.visit(MonitoringConditionsPage, {
          orderId: mockOrderId,
        })

        page.form.saveAndContinueButton.click()

        page.form.conditionTypeField.shouldHaveValidationMessage(errorMessages.conditionTypeRequired)
        page.form.monitoringRequiredField.shouldHaveValidationMessage(errorMessages.monitoringTypeRequired)
        page.form.startDateField.shouldHaveValidationMessage(errorMessages.startDateRequired)
        page.form.sentenceTypeField.shouldHaveValidationMessage(errorMessages.sentenceTypeRequired)
        page.form.pilotField.shouldHaveValidationMessage(errorMessages.pilotRequired)
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(errorMessages.conditionTypeRequired)
        page.errorSummary.shouldHaveError(errorMessages.monitoringTypeRequired)
        page.errorSummary.shouldHaveError(errorMessages.startDateRequired)
        page.errorSummary.shouldHaveError(errorMessages.endDateRequired)
        page.errorSummary.shouldHaveError(errorMessages.sentenceTypeRequired)
        page.errorSummary.shouldHaveError(errorMessages.pilotRequired)
      })

      it('should show errors from API response if frontend validation passes', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: '/monitoring-conditions',
          response: [
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
        page.form.conditionTypeField.shouldHaveValidationMessage('Test error - condition type')
        page.form.monitoringRequiredField.shouldHaveValidationMessage('Test error - monitoring required')
        page.form.startDateField.shouldHaveValidationMessage('Test error - start date')
        page.form.endDateField.shouldHaveValidationMessage('Test error - end date')
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Test error - condition type')
        page.errorSummary.shouldHaveError('Test error - monitoring required')
        page.errorSummary.shouldHaveError('Test error - start date')
        page.errorSummary.shouldHaveError('Test error - end date')
      })

      context('order is ddv4', () => {
        it('Should show the user validation errors', () => {
          cy.task('stubCemoGetOrder', {
            httpStatus: 200,
            id: mockOrderId,
            status: 'IN_PROGRESS',
            order: { dataDictionaryVersion: 'DDV4' },
          })
          cy.task('stubCemoSubmitOrder', { httpStatus: 200, id: mockOrderId, subPath: apiPath, response: [] })

          const page = Page.visit(MonitoringConditionsPage, {
            orderId: mockOrderId,
          })

          page.form.saveAndContinueButton.click()

          page.form.orderTypeDescriptionField.shouldHaveValidationMessage(errorMessages.pilotRequired)
          page.form.conditionTypeField.shouldHaveValidationMessage(errorMessages.conditionTypeRequired)
          page.form.monitoringRequiredField.shouldHaveValidationMessage(errorMessages.monitoringTypeRequired)
          page.form.startDateField.shouldHaveValidationMessage(errorMessages.startDateRequired)
          page.errorSummary.shouldExist()
          page.errorSummary.shouldHaveError(errorMessages.pilotRequired)
          page.errorSummary.shouldHaveError(errorMessages.conditionTypeRequired)
          page.errorSummary.shouldHaveError(errorMessages.monitoringTypeRequired)
          page.errorSummary.shouldHaveError(errorMessages.startDateRequired)
          page.errorSummary.shouldHaveError(errorMessages.endDateRequired)
        })
      })
    })
  })
})
