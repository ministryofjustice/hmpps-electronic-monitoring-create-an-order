import IndexPage from '../pages/index'
import OrderTasksPage from '../pages/order/summary'
import Page from '../pages/page'

context('Index', () => {
  context('Health backend', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
    })

    it('User name visible in header', () => {
      cy.signIn()
      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.header.userName().should('contain.text', 'J. Smith')
    })

    it('Phase banner visible in header', () => {
      cy.signIn()
      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.header.phaseBanner().should('contain.text', 'dev')
    })

    it('Create new form button should exist', () => {
      cy.signIn()
      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.newOrderFormButton.should('exist')
    })

    it('Create new form button redirects user to new form page', () => {
      cy.signIn()
      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.newOrderFormButton.click()
      Page.verifyOnPage(OrderTasksPage)
    })

    it('Should display search results to the user', () => {
      cy.signIn()

      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.orders.should('exist').should('have.length', 2)

      indexPage.IncompleteOrderFor('New form').should('exist')
      indexPage.SubmittedOrderFor('test tester').should('exist')
      indexPage.DraftOrderFor('test tester').should('exist')
    })

    it('Should be accessible', () => {
      cy.signIn().visit(`/`)
      const page = Page.verifyOnPage(IndexPage)
      page.checkIsAccessible()
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders', 500)
    })

    it('Should indicate to the user that there were no results', () => {
      cy.signIn()

      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.orders.should('exist').and('have.length', 0)
      cy.contains('No existing forms found.').should('exist')
    })
  })
})
