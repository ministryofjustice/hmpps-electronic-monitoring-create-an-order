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
            { field: 'zoneType', error: expectedValidationErrorMessage },
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
        const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(EnforcementZonePage)

        page.form.zoneTypeField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.startDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.endDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.uploadField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.descriptionField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.durationField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.anotherZoneField.shouldHaveValidationMessage(expectedValidationErrorMessage)
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
        const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(EnforcementZonePage)

        page.form.zoneTypeField.shouldNotHaveValidationMessage()
        page.form.startDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.endDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.uploadField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.descriptionField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.durationField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.anotherZoneField.shouldHaveValidationMessage(expectedValidationErrorMessage)
      })
    })

    context('with only start date entered', () => {
      beforeEach(() => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [
            { field: 'zoneType', error: expectedValidationErrorMessage },
            { field: 'endDate', error: expectedValidationErrorMessage },
            { field: 'file', error: expectedValidationErrorMessage },
            { field: 'description', error: expectedValidationErrorMessage },
            { field: 'duration', error: expectedValidationErrorMessage },
            { field: 'anotherZone', error: expectedValidationErrorMessage },
          ],
        })
      })

      it('Should display validation error messages', () => {
        const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(EnforcementZonePage)

        page.form.zoneTypeField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.startDateField.shouldNotHaveValidationMessage()
        page.form.endDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.uploadField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.descriptionField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.durationField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.anotherZoneField.shouldHaveValidationMessage(expectedValidationErrorMessage)
      })
    })

    context('with only end date entered', () => {
      beforeEach(() => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [
            { field: 'zoneType', error: expectedValidationErrorMessage },
            { field: 'startDate', error: expectedValidationErrorMessage },
            { field: 'file', error: expectedValidationErrorMessage },
            { field: 'description', error: expectedValidationErrorMessage },
            { field: 'duration', error: expectedValidationErrorMessage },
            { field: 'anotherZone', error: expectedValidationErrorMessage },
          ],
        })
      })

      it('Should display validation error messages', () => {
        const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(EnforcementZonePage)

        page.form.zoneTypeField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.startDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.endDateField.shouldNotHaveValidationMessage()
        page.form.uploadField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.descriptionField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.durationField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.anotherZoneField.shouldHaveValidationMessage(expectedValidationErrorMessage)
      })
    })

    context('with invalid date formats entered', () => {
      context('start date', () => {
        it('should show error when date of birth is provided in the wrong format', () => {
          const dateFormatValidationMessage =
            'Date is in an incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.'
          const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId })

          cy.get('#startDate-startDay').type('text')

          page.form.saveAndContinueButton.click()

          Page.verifyOnPage(EnforcementZonePage)

          page.form.startDateField.shouldHaveValidationMessage(dateFormatValidationMessage)
        })
      })

      context('end date', () => {
        it('should show error when date of birth is provided in the wrong format', () => {
          const dateFormatValidationMessage =
            'Date is in an incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.'
          const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId })

          cy.get('#endDate-endDay').type('text')

          page.form.saveAndContinueButton.click()

          Page.verifyOnPage(EnforcementZonePage)

          page.form.endDateField.shouldHaveValidationMessage(dateFormatValidationMessage)
        })
      })
    })

    context('with only file entered', () => {
      beforeEach(() => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [
            { field: 'zoneType', error: expectedValidationErrorMessage },
            { field: 'startDate', error: expectedValidationErrorMessage },
            { field: 'endDate', error: expectedValidationErrorMessage },
            { field: 'description', error: expectedValidationErrorMessage },
            { field: 'duration', error: expectedValidationErrorMessage },
            { field: 'anotherZone', error: expectedValidationErrorMessage },
          ],
        })
      })

      it('Should display validation error messages', () => {
        const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(EnforcementZonePage)

        page.form.zoneTypeField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.startDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.endDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.uploadField.shouldNotHaveValidationMessage()
        page.form.descriptionField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.durationField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.anotherZoneField.shouldHaveValidationMessage(expectedValidationErrorMessage)
      })
    })

    context('with only description entered', () => {
      beforeEach(() => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [
            { field: 'zoneType', error: expectedValidationErrorMessage },
            { field: 'startDate', error: expectedValidationErrorMessage },
            { field: 'endDate', error: expectedValidationErrorMessage },
            { field: 'file', error: expectedValidationErrorMessage },
            { field: 'duration', error: expectedValidationErrorMessage },
            { field: 'anotherZone', error: expectedValidationErrorMessage },
          ],
        })
      })

      it('Should display validation error messages', () => {
        const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(EnforcementZonePage)

        page.form.zoneTypeField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.startDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.endDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.uploadField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.descriptionField.shouldNotHaveValidationMessage()
        page.form.durationField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.anotherZoneField.shouldHaveValidationMessage(expectedValidationErrorMessage)
      })
    })

    context('with only duration entered', () => {
      beforeEach(() => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [
            { field: 'zoneType', error: expectedValidationErrorMessage },
            { field: 'startDate', error: expectedValidationErrorMessage },
            { field: 'endDate', error: expectedValidationErrorMessage },
            { field: 'file', error: expectedValidationErrorMessage },
            { field: 'description', error: expectedValidationErrorMessage },
            { field: 'anotherZone', error: expectedValidationErrorMessage },
          ],
        })
      })

      it('Should display validation error messages', () => {
        const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(EnforcementZonePage)

        page.form.zoneTypeField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.startDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.endDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.uploadField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.descriptionField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.durationField.shouldNotHaveValidationMessage()
        page.form.anotherZoneField.shouldHaveValidationMessage(expectedValidationErrorMessage)
      })
    })

    context('with only another zone entered', () => {
      beforeEach(() => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [
            { field: 'zoneType', error: expectedValidationErrorMessage },
            { field: 'startDate', error: expectedValidationErrorMessage },
            { field: 'endDate', error: expectedValidationErrorMessage },
            { field: 'file', error: expectedValidationErrorMessage },
            { field: 'description', error: expectedValidationErrorMessage },
            { field: 'duration', error: expectedValidationErrorMessage },
          ],
        })
      })

      it('Should display validation error messages', () => {
        const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(EnforcementZonePage)

        page.form.zoneTypeField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.startDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.endDateField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.uploadField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.descriptionField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.durationField.shouldHaveValidationMessage(expectedValidationErrorMessage)
        page.form.anotherZoneField.shouldNotHaveValidationMessage()
      })
    })
  })
})
