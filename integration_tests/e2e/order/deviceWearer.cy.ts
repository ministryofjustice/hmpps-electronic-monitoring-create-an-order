import { v4 as uuidv4 } from 'uuid'
import ErrorPage from '../../pages/error'
import Page from '../../pages/page'
import IndexPage from '../../pages/index'
import OrderTasksPage from '../../pages/order/summary'
import AboutDeviceWearerPage from '../../pages/order/deviceWearer/about'
import ResponsibleAdultPage from '../../pages/order/deviceWearer/responsibleAdult'

const mockOrderId = uuidv4()

context('About the device wearer', () => {
  context('Draft order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
    })

    it('Should display the user name visible in header', () => {
      cy.signIn().visit(`/order/${mockOrderId}/about-the-device-wearer`)
      const page = Page.verifyOnPage(AboutDeviceWearerPage)
      page.header.userName().should('contain.text', 'J. Smith')
    })

    it('Should display the phase banner in header', () => {
      cy.signIn().visit(`/order/${mockOrderId}/about-the-device-wearer`)
      const page = Page.verifyOnPage(AboutDeviceWearerPage)
      page.header.phaseBanner().should('contain.text', 'dev')
    })

    it('Should render the save and continue/return buttons', () => {
      cy.signIn().visit(`/order/${mockOrderId}/about-the-device-wearer`)
      const page = Page.verifyOnPage(AboutDeviceWearerPage)
      page.form.hasAction(`/order/${mockOrderId}/about-the-device-wearer`)
      page.form.saveAndContinueButton().should('exist')
      page.form.saveAndReturnButton().should('exist')
      page.backToSummaryButton().should('not.exist')
    })

    it('Should be accessible', () => {
      cy.signIn().visit(`/order/${mockOrderId}/about-the-device-wearer`)
      const page = Page.verifyOnPage(AboutDeviceWearerPage)
      page.checkIsAccessible()
    })
  })

  context('Submitting a valid order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoPutDeviceWearer', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
    })

    context('given I am on the device wearers details page', () => {
      let aboutDeviceWearerPage: AboutDeviceWearerPage

      beforeEach(() => {
        cy.signIn()

        const indexPage = Page.verifyOnPage(IndexPage)
        indexPage.newOrderFormButton().click()

        const orderTasksPage = Page.verifyOnPage(OrderTasksPage)
        orderTasksPage.AboutTheDeviceWearerSectionItem().click()

        aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
      })

      context('when a valid set of data is entered into the device wearer details form', () => {
        beforeEach(() => {
          aboutDeviceWearerPage.form.fillInWith({
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
              year: '1972',
            },

            is18: true,
            sex: 'Male',
            genderIdentity: 'Male',
          })
        })

        it('should continue to collect the responsible officer details', () => {
          aboutDeviceWearerPage.form.saveAndContinueButton().click()

          Page.verifyOnPage(ResponsibleAdultPage)
        })
      })
    })
  })

  context('Submitted order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'SUBMITTED' })
    })

    it('Should display the back to summary button', () => {
      cy.signIn().visit(`/order/${mockOrderId}/about-the-device-wearer`)
      const page = Page.verifyOnPage(AboutDeviceWearerPage)
      page.form.saveAndContinueButton().should('not.exist')
      page.form.saveAndReturnButton().should('not.exist')
      page.backToSummaryButton().should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}/about-the-device-wearer`, { failOnStatusCode: false })

      Page.verifyOnPage(ErrorPage, 'Not Found')
    })
  })
})
