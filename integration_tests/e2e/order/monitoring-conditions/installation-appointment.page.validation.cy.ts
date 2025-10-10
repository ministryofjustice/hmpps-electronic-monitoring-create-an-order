import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationAppointmentPage from '../../../pages/order/monitoring-conditions/installation-appointment'

const mockOrderId = uuidv4()
context('Monitoring conditions', () => {
  context('Installation location', () => {
    context('Validations', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
        })

        cy.signIn()
      })

      it('Should show error when no data is entered', () => {
        const page = Page.visit(InstallationAppointmentPage, { orderId: mockOrderId })
        page.form.saveAndContinueButton.click()

        page.form.placeNameField.shouldHaveValidationMessage('Enter name of the place where installation takes place')
        cy.get('.form-date').contains('Enter date of installation')
        cy.get('.form-time').contains('Enter time of installation')
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Enter name of the place where installation takes place')
        page.errorSummary.shouldHaveError('Enter date of installation')
        page.errorSummary.shouldHaveError('Enter time of installation')
      })
      context('Date validations', () => {
        const validFormData = {
          placeName: 'Mock Place',
          appointmentDate: new Date(2025, 0, 1, 10, 0, 0),
        }

        it('Should show error when appointment date is not real date', () => {
          const page = Page.visit(InstallationAppointmentPage, { orderId: mockOrderId })
          page.form.fillInWith(validFormData)
          page.form.appointmentDateField.setDay('a')
          page.form.saveAndContinueButton.click()
          page.form.appointmentDateField.shouldHaveValidationMessage('Date of installation must be a real date')
          page.errorSummary.shouldExist()
          page.errorSummary.shouldHaveError('Date of installation must be a real date')
        })

        it('Should show error when appointment date year is incorrect formatted', () => {
          const page = Page.visit(InstallationAppointmentPage, { orderId: mockOrderId })
          page.form.fillInWith(validFormData)
          page.form.appointmentDateField.setYear('text')
          page.form.saveAndContinueButton.click()
          page.form.appointmentDateField.shouldHaveValidationMessage('Year must include 4 numbers')
          page.errorSummary.shouldExist()
          page.errorSummary.shouldHaveError('Year must include 4 numbers')
        })

        it('Should show error when appointment date day is missing', () => {
          const page = Page.visit(InstallationAppointmentPage, { orderId: mockOrderId })
          page.form.placeNameField.set('Mock Place')
          page.form.appointmentDateField.setMonth('01')
          page.form.appointmentDateField.setYear('2025')
          page.form.saveAndContinueButton.click()
          page.form.appointmentDateField.shouldHaveValidationMessage('Date of installation must include a day')
          page.errorSummary.shouldExist()
          page.errorSummary.shouldHaveError('Date of installation must include a day')
        })

        it('Should show error when appointment date month is missing', () => {
          const page = Page.visit(InstallationAppointmentPage, { orderId: mockOrderId })
          page.form.placeNameField.set('Mock Place')
          page.form.appointmentDateField.setDay('01')
          page.form.appointmentDateField.setYear('2025')
          page.form.saveAndContinueButton.click()
          page.form.appointmentDateField.shouldHaveValidationMessage('Date of installation must include a month')
          page.errorSummary.shouldExist()
          page.errorSummary.shouldHaveError('Date of installation must include a month')
        })

        it('Should show error when appointment date year is missing', () => {
          const page = Page.visit(InstallationAppointmentPage, { orderId: mockOrderId })
          page.form.placeNameField.set('Mock Place')
          page.form.appointmentDateField.setDay('01')
          page.form.appointmentDateField.setMonth('01')
          page.form.saveAndContinueButton.click()
          page.form.appointmentDateField.shouldHaveValidationMessage('Date of installation must include a year')
          page.errorSummary.shouldExist()
          page.errorSummary.shouldHaveError('Date of installation must include a year')
        })

        it('Should show error when appointment date time is missing', () => {
          const page = Page.visit(InstallationAppointmentPage, { orderId: mockOrderId })
          page.form.placeNameField.set('Mock Place')
          page.form.appointmentDateField.setDay('01')
          page.form.appointmentDateField.setMonth('01')
          page.form.appointmentDateField.setYear('2025')
          page.form.saveAndContinueButton.click()
          page.form.appointmentDateField.shouldHaveValidationMessage('Enter time of installation')
          page.errorSummary.shouldExist()
          page.errorSummary.shouldHaveError('Enter time of installation')
        })

        it('Should show error when appointment date time hour is missing', () => {
          const page = Page.visit(InstallationAppointmentPage, { orderId: mockOrderId })
          page.form.placeNameField.set('Mock Place')
          page.form.appointmentDateField.setDay('01')
          page.form.appointmentDateField.setMonth('01')
          page.form.appointmentDateField.setYear('2025')
          page.form.appointmentDateField.setMinutes('59')
          page.form.saveAndContinueButton.click()
          page.form.appointmentDateField.shouldHaveValidationMessage('Time of installation must include an hour')
          page.errorSummary.shouldExist()
          page.errorSummary.shouldHaveError('Time of installation must include an hour')
        })

        it('Should show error when appointment date time minute is missing', () => {
          const page = Page.visit(InstallationAppointmentPage, { orderId: mockOrderId })
          page.form.placeNameField.set('Mock Place')
          page.form.appointmentDateField.setDay('01')
          page.form.appointmentDateField.setMonth('01')
          page.form.appointmentDateField.setYear('2025')
          page.form.appointmentDateField.setHours('20')
          page.form.saveAndContinueButton.click()
          page.form.appointmentDateField.shouldHaveValidationMessage('Time of installation must include a minute')
          page.errorSummary.shouldExist()
          page.errorSummary.shouldHaveError('Time of installation must include a minute')
        })
      })
    })
  })
})
