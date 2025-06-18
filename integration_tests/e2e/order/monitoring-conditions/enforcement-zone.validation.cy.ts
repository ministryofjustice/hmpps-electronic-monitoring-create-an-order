import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import EnforcementZonePage from '../../../pages/order/monitoring-conditions/enforcement-zone'

const mockOrderId = uuidv4()
const apiPath = '/enforcementZone'

context('Monitoring conditions - Enforcement Zone', () => {
  context('Submitting an invalid order', () => {
    const expectedValidationErrorMessage = 'Test validation message'

    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    context('with no data entered', () => {
      beforeEach(() => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [
            { field: 'startDate', error: expectedValidationErrorMessage },
            { field: 'endDate', error: expectedValidationErrorMessage },
            { field: 'file', error: expectedValidationErrorMessage },
            { field: 'description', error: expectedValidationErrorMessage },
            { field: 'duration', error: expectedValidationErrorMessage },
            { field: 'anotherZone', error: expectedValidationErrorMessage },
          ],
        })
      })

      it('Should display validation error messages when submit empty request', () => {
        const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId, zoneId: 0 })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(EnforcementZonePage)
        page.form.startDateField.shouldHaveValidationMessage('Enter start date for enforcement zone')
        page.form.endDateField.shouldHaveValidationMessage('Enter end date for enforcement zone')
        page.form.descriptionField.shouldHaveValidationMessage('Enforcement zone description is required')
        page.form.durationField.shouldHaveValidationMessage('Enforcement zone duration is required')
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Enter start date for enforcement zone')
        page.errorSummary.shouldHaveError('Enter end date for enforcement zone')
        page.errorSummary.shouldHaveError('Enforcement zone description is required')
        page.errorSummary.shouldHaveError('Enforcement zone duration is required')
      })
    })

    context('with only zone type entered', () => {
      beforeEach(() => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [
            { field: 'startDate', error: expectedValidationErrorMessage },
            { field: 'endDate', error: expectedValidationErrorMessage },
            { field: 'file', error: expectedValidationErrorMessage },
            { field: 'description', error: expectedValidationErrorMessage },
            { field: 'duration', error: expectedValidationErrorMessage },
            { field: 'anotherZone', error: expectedValidationErrorMessage },
          ],
        })
      })

      it('Should display validation error messages', () => {
        const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId, zoneId: 0 })

        const validFormData = {
          zoneType: 'EXCLUSION',
          startDate: new Date('2024-12-10T00:00:00.000Z'),
          endDate: new Date('2024-12-11T00:00:00.000Z'),
          description: 'A test description: Lorum ipsum dolar sit amet...',
          duration: 'A test duration: Lorum ipsum dolar sit amet...',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()
        Page.verifyOnPage(EnforcementZonePage)

        page.form.startDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.endDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.uploadField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.descriptionField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.durationField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.anotherZoneField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrorMessage)
      })
    })
  })
})
