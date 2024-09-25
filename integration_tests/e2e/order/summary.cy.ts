import { v4 as uuidv4 } from 'uuid'
import OrderSummaryPage from '../../pages/order/summary'
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
      const page = Page.verifyOnPage(OrderSummaryPage)
      page.headerUserName().should('contain.text', 'J. Smith')
    })

    it('Phase banner visible in header', () => {
      cy.signIn().visit(`/order/${mockOrderId}/summary`)
      const page = Page.verifyOnPage(OrderSummaryPage)
      page.headerPhaseBanner().should('contain.text', 'dev')
    })

    it('Submit order form should exist', () => {
      cy.signIn().visit(`/order/${mockOrderId}/summary`)
      const page = Page.verifyOnPage(OrderSummaryPage)
      page.submissionForm().should('exist').should('have.attr', 'action', `/order/${mockOrderId}/submit`)
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
      const page = Page.verifyOnPage(OrderSummaryPage)
      page.backToSearchButton().should('exist')
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
      cy.signIn().visit('/order/123456789/summary')

      Page.verifyOnPage(ErrorPage, 'Could not find an order with id: 123456789')
    })
  })
})
