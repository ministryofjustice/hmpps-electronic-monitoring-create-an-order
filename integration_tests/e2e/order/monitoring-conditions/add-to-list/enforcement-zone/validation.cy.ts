import { v4 as uuidv4 } from 'uuid'
import { fakerEN_GB as faker } from '@faker-js/faker'
import Page from '../../../../../pages/page'
import EnforcementZoneAddToListPage from './EnforcementZonePage'

const mockOrderId = uuidv4()
const apiPath = `/enforcementZone`
const zoneTypes: (`exclusion` | `restriction`)[] = [`exclusion`, `restriction`]
zoneTypes.forEach(type => {
  context(`Monitoring conditions - ${type} Zone`, () => {
    context(`Submitting an invalid order`, () => {
      const expectedValidationErrorMessage = `Test validation message`

      beforeEach(() => {
        cy.task(`reset`)
        cy.task(`stubSignIn`, { name: `john smith`, roles: [`ROLE_EM_CEMO__CREATE_ORDER`] })

        cy.task(`stubCemoGetOrder`, { httpStatus: 200, id: mockOrderId, status: `IN_PROGRESS` })

        cy.signIn()
      })

      context(`with no data entered`, () => {
        beforeEach(() => {
          cy.task(`stubCemoSubmitOrder`, {
            httpStatus: 400,
            id: mockOrderId,
            subPath: apiPath,
            response: [
              { field: `startDate`, error: expectedValidationErrorMessage },
              { field: `endDate`, error: expectedValidationErrorMessage },
              { field: `name`, error: expectedValidationErrorMessage },
              { field: `file`, error: expectedValidationErrorMessage },
              { field: `description`, error: expectedValidationErrorMessage },
              { field: `duration`, error: expectedValidationErrorMessage },
            ],
          })
        })

        it(`Should display validation error messages when submit empty request`, () => {
          const page = Page.visit(EnforcementZoneAddToListPage, { orderId: mockOrderId, zoneId: 0 }, undefined, type)

          page.form.saveAndContinueButton.click()

          Page.verifyOnPage(EnforcementZoneAddToListPage, undefined, undefined, type)
          page.form.startDateField.shouldHaveValidationMessage(`Enter start date for ${type} zone`)
          page.form.endDateField.shouldHaveValidationMessage(`Enter end date for ${type} zone`)
          page.form.nameField.shouldHaveValidationMessage(`Enter the name of the ${type} zone`)
          page.form.descriptionField.shouldHaveValidationMessage(`Enter where the ${type} zone is required`)
          page.form.durationField.shouldHaveValidationMessage(`Enter when the ${type} zone must be followed`)
          page.errorSummary.shouldExist()
          page.errorSummary.verifyErrorSummary([
            `Enter start date for ${type} zone`,
            `Enter end date for ${type} zone`,
            `Enter the name of the ${type} zone`,
            `Enter where the ${type} zone is required`,
            `Enter when the ${type} zone must be followed`,
          ])
        })
      })

      context(`with only zone type entered`, () => {
        beforeEach(() => {
          cy.task(`stubCemoSubmitOrder`, {
            httpStatus: 400,
            id: mockOrderId,
            subPath: apiPath,
            response: [
              { field: `startDate`, error: expectedValidationErrorMessage },
              { field: `endDate`, error: expectedValidationErrorMessage },
              { field: `name`, error: expectedValidationErrorMessage },
              { field: `file`, error: expectedValidationErrorMessage },
              { field: `description`, error: expectedValidationErrorMessage },
              { field: `duration`, error: expectedValidationErrorMessage },
            ],
          })
        })

        it(`Should display validation error messages`, () => {
          const page = Page.visit(EnforcementZoneAddToListPage, { orderId: mockOrderId, zoneId: 0 }, undefined, type)

          const validFormData = {
            zoneType: `EXCLUSION`,
            startDate: new Date(`2024-12-10T00:00:00.000Z`),
            endDate: new Date(`2024-12-11T00:00:00.000Z`),
            name: `A test name: Lorem ipsum dolor sit amet...`,
            description: `A test description: Lorem ipsum dolor sit amet...`,
            duration: `A test duration: Lorem ipsum dolor sit amet...`,
          }

          page.form.fillInWith(validFormData)
          page.form.saveAndContinueButton.click()
          Page.verifyOnPage(EnforcementZoneAddToListPage, undefined, undefined, type)

          page.form.startDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
          page.form.endDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
          page.form.nameField.shouldHaveValidationMessage(expectedValidationErrorMessage)
          page.form.uploadField.shouldHaveValidationMessage(expectedValidationErrorMessage)
          page.form.descriptionField.shouldHaveValidationMessage(expectedValidationErrorMessage)
          page.form.durationField.shouldHaveValidationMessage(expectedValidationErrorMessage)
          page.errorSummary.shouldExist()
          page.errorSummary.shouldHaveError(expectedValidationErrorMessage)
        })
      })

      context(`when description and duration are too long`, () => {
        beforeEach(() => {
          cy.task(`stubCemoSubmitOrder`, {
            httpStatus: 400,
            id: mockOrderId,
            subPath: apiPath,
            response: [
              { field: `description`, error: `Where is the ${type} zone must be 500 characters or less` },
              { field: `duration`, error: `When must the ${type} zone be followed must be 200 characters or less` },
            ],
          })
        })

        it(`should display error messages when ${type} zone fields (description, duration) are longer than 500 characters`, () => {
          const page = Page.visit(EnforcementZoneAddToListPage, { orderId: mockOrderId, zoneId: 0 }, undefined, type)
          const formData = {
            zoneType: `EXCLUSION`,
            startDate: new Date(`2025-12-10T00:00:00.000Z`),
            endDate: new Date(`2025-12-11T00:00:00.000Z`),
            name: `test name`,
            description: faker.string.fromCharacters(
              `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`,
              501,
            ),
            duration: faker.string.fromCharacters(
              `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`,
              201,
            ),
          }

          page.form.fillInWith(formData)
          page.form.descriptionField.shouldHaveValidationMessage(`You have 1 character too many`)
          page.form.durationField.shouldHaveValidationMessage(`You have 1 character too many`)

          page.form.saveAndContinueButton.click()

          Page.verifyOnPage(EnforcementZoneAddToListPage, undefined, undefined, type)
          page.form.descriptionField.shouldHaveValidationMessage(
            `Where is the ${type} zone must be 500 characters or less`,
          )
          page.form.durationField.shouldHaveValidationMessage(
            `When must the ${type} zone be followed must be 200 characters or less`,
          )
          page.errorSummary.shouldExist()
          page.errorSummary.shouldHaveError(`Where is the ${type} zone must be 500 characters or less`)
          page.errorSummary.shouldHaveError(`When must the ${type} zone be followed must be 200 characters or less`)
        })
      })
    })
  })
})
