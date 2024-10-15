import { v4 as uuidv4 } from 'uuid'
import { NotFoundErrorPage } from '../../../pages/error'
import Page from '../../../pages/page'
import AboutDeviceWearerPage from '../../../pages/order/about-the-device-wearer/device-wearer'
import ResponsibleAdultPage from '../../../pages/order/about-the-device-wearer/responsible-adult-details'
import ContactDetailsPage from '../../../pages/order/contact-information/contactDetails'

const mockOrderId = uuidv4()

context('About the device wearer', () => {
  context('Draft order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    it('Should display the user name visible in header', () => {
      const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })
      page.header.userName().should('contain.text', 'J. Smith')
    })

    it('Should display the phase banner in header', () => {
      const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })
      page.header.phaseBanner().should('contain.text', 'dev')
    })

    it('Should render the save and continue/return buttons', () => {
      const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })
      page.form.saveAndContinueButton().should('exist')
      page.form.saveAndReturnButton().should('exist')
      page.backToSummaryButton().should('not.exist')
    })

    it('Should be accessible', () => {
      const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })
  })

  context('Submitting a valid order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoListOrders', 200)
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoPutDeviceWearer', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    context('for someone over 18 years old', () => {
      const birthYear = 1970

      // TODO: FAILS because filling in an over 18 device wearer should skip the responsible adult step
      it.skip('should continue to collect the responsible officer details', () => {
        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        const validFormData = {
          nomisId: '1234567',
          pncId: '1234567',
          deliusId: '1234567',
          prisonNumber: '1234567',

          firstNames: 'Barton',
          lastName: 'Fink',
          alias: 'Barty',

          dob: {
            date: '01',
            month: '01',
            year: `${birthYear}`,
          },

          is18: true,
          sex: 'Male',
          genderIdentity: 'Male',
        }

        page.form.fillInWith(validFormData)

        page.form.saveAndContinueButton().click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}/device-wearer`,
          body: {
            nomisId: '1234567',
            pncId: '1234567',
            deliusId: '1234567',
            prisonNumber: '1234567',
            firstName: 'Barton',
            lastName: 'Fink',
            alias: 'Barty',
            adultAtTimeOfInstallation: 'true',
            sex: 'male',
            gender: 'male',
            dateOfBirth: `${birthYear}-01-01T00:00:00.000Z`,
            disabilities: '',
          },
        })

        Page.verifyOnPage(ContactDetailsPage)
      })
    })

    context('for someone under 18 years old', () => {
      const birthYear = new Date().getFullYear() - 16

      it('should continue to collect the responsible adult details', () => {
        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        const validFormData = {
          nomisId: '1234567',
          pncId: '1234567',
          deliusId: '1234567',
          prisonNumber: '1234567',

          firstNames: 'Barton',
          lastName: 'Fink',
          alias: 'Barty',

          dob: {
            date: '01',
            month: '01',
            year: `${birthYear}`,
          },

          is18: true,
          sex: 'Male',
          genderIdentity: 'Male',
        }

        page.form.fillInWith(validFormData)

        page.form.saveAndContinueButton().click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}/device-wearer`,
          body: {
            nomisId: '1234567',
            pncId: '1234567',
            deliusId: '1234567',
            prisonNumber: '1234567',
            firstName: 'Barton',
            lastName: 'Fink',
            alias: 'Barty',
            adultAtTimeOfInstallation: 'true',
            sex: 'male',
            gender: 'male',
            dateOfBirth: `${birthYear}-01-01T00:00:00.000Z`,
            disabilities: '',
          },
        })

        Page.verifyOnPage(ResponsibleAdultPage)
      })
    })
  })

  context('Submitted order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'SUBMITTED' })

      cy.signIn()
    })

    it('Should display the back to summary button', () => {
      const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

      page.form.saveAndContinueButton().should('not.exist')
      page.form.saveAndReturnButton().should('not.exist')
      page.backToSummaryButton().should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}/about-the-device-wearer`, { failOnStatusCode: false })

      Page.verifyOnPage(NotFoundErrorPage)
    })
  })
})
