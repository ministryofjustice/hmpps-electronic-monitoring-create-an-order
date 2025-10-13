import { v4 as uuidv4 } from 'uuid'
import { fakerEN_GB as faker } from '@faker-js/faker'
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
        page.form.startDateField.shouldHaveValidationMessage('Enter start date for exclusion zone')
        page.form.endDateField.shouldHaveValidationMessage('Enter end date for exclusion zone')
        page.form.descriptionField.shouldHaveValidationMessage('Enter where the exclusion zone is required')
        page.form.durationField.shouldHaveValidationMessage('Enter when the exclusion zone must be followed')
        page.form.anotherZoneField.shouldHaveValidationMessage('Select ‘Yes’ if you need to add another exclusion zone')
        page.errorSummary.shouldExist()
        page.errorSummary.verifyErrorSummary([
          'Enter start date for exclusion zone',
          'Enter end date for exclusion zone',
          'Enter where the exclusion zone is required',
          'Enter when the exclusion zone must be followed',
          'Select ‘Yes’ if you need to add another exclusion zone',
        ])
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
          anotherZone: 'No',
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

    context('when description and duration are too long', () => {
      beforeEach(() => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [
            { field: 'description', error: 'Where is the exclusion zone must be 200 characters or less' },
            { field: 'duration', error: 'When must the exclusion zone be followed must be 200 characters or less' },
          ],
        })
      })

      it('should display error messages when exclusion zone fields (description, duration) are longer than 200 characters', () => {
        const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId, zoneId: 0 })

        const formData = {
          zoneType: 'EXCLUSION',
          startDate: new Date('2025-12-10T00:00:00.000Z'),
          endDate: new Date('2025-12-11T00:00:00.000Z'),
          description: faker.string.fromCharacters(
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            201,
          ),
          duration: faker.string.fromCharacters('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 201),
        }

        page.form.fillInWith(formData)
        page.form.descriptionField.shouldHaveValidationMessage('You have 1 character too many')
        page.form.durationField.shouldHaveValidationMessage('You have 1 character too many')

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(EnforcementZonePage)
        page.form.descriptionField.shouldHaveValidationMessage(
          'Where is the exclusion zone must be 200 characters or less',
        )
        page.form.durationField.shouldHaveValidationMessage(
          'When must the exclusion zone be followed must be 200 characters or less',
        )
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Where is the exclusion zone must be 200 characters or less')
        page.errorSummary.shouldHaveError('When must the exclusion zone be followed must be 200 characters or less')
      })
    })
  })
})
