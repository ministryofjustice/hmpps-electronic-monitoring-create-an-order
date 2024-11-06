import { v4 as uuidv4 } from 'uuid'
import OrderTasksPage from '../../pages/order/summary'
import ErrorPage from '../../pages/error'
import Page from '../../pages/page'

const mockOrderId = uuidv4()

context('Order Summary', () => {
  context('Draft Order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
    })

    it('User name visible in header', () => {
      cy.signIn().visit(`/order/${mockOrderId}/summary`)
      const page = Page.verifyOnPage(OrderTasksPage)
      page.header.userName().should('contain.text', 'J. Smith')
    })

    it('Phase banner visible in header', () => {
      cy.signIn().visit(`/order/${mockOrderId}/summary`)
      const page = Page.verifyOnPage(OrderTasksPage)
      page.header.phaseBanner().should('contain.text', 'dev')
    })

    it('Submit order form should exist', () => {
      cy.signIn().visit(`/order/${mockOrderId}/summary`)
      const page = Page.verifyOnPage(OrderTasksPage)
      page.submitOrderButton.should('exist')
    })

    it.skip('Should be accessible', () => {
      cy.signIn().visit(`/order/${mockOrderId}/summary`)
      const page = Page.verifyOnPage(OrderTasksPage)
      page.checkIsAccessible()
    })
  })

  context('Submitted Order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'SUBMITTED' })
    })

    it('Submit order form should exist', () => {
      cy.signIn().visit(`/order/${mockOrderId}/summary`)
      const page = Page.verifyOnPage(OrderTasksPage)
      page.backToSearchButton.should('exist')
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
      cy.signIn().visit(`/order/${mockOrderId}/summary`, { failOnStatusCode: false })

      Page.verifyOnPage(ErrorPage, 'Not Found')
    })
  })
})
