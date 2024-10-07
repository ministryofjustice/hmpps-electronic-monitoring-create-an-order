import { v4 as uuidv4 } from 'uuid'
import ErrorPage from '../../pages/error'
import DeviceWearerPage from '../../pages/order/deviceWearer'
import Page from '../../pages/page'

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
      const page = Page.verifyOnPage(DeviceWearerPage)
      page.headerUserName().should('contain.text', 'J. Smith')
    })

    it('Should display the phase banner in header', () => {
      cy.signIn().visit(`/order/${mockOrderId}/about-the-device-wearer`)
      const page = Page.verifyOnPage(DeviceWearerPage)
      page.headerPhaseBanner().should('contain.text', 'dev')
    })

    it('Should render the save and continue/return buttons', () => {
      cy.signIn().visit(`/order/${mockOrderId}/about-the-device-wearer`)
      const page = Page.verifyOnPage(DeviceWearerPage)
      page.form().should('exist').should('have.attr', 'action', `/order/${mockOrderId}/about-the-device-wearer`)
      page.saveAndContinueButton().should('exist')
      page.saveAndReturnButton().should('exist')
      page.backToSummaryButton().should('not.exist')
    })
  })

  context('Submitted Order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'SUBMITTED' })
    })

    it('Should display the back to summary button', () => {
      cy.signIn().visit(`/order/${mockOrderId}/about-the-device-wearer`)
      const page = Page.verifyOnPage(DeviceWearerPage)
      page.saveAndContinueButton().should('not.exist')
      page.saveAndReturnButton().should('not.exist')
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
