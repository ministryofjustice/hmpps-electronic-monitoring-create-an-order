import IndexPage from '../pages/index'
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
      indexPage.headerUserName().should('contain.text', 'J. Smith')
    })

    it('Phase banner visible in header', () => {
      cy.signIn()
      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.headerPhaseBanner().should('contain.text', 'dev')
    })

    it('Create new form should exist', () => {
      cy.signIn()
      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.newOrderForm().should('exist')
    })

    it('Create new form button redirects user to new form page', () => {
      cy.signIn()
      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.newOrderFormButton().click()
      cy.url().should('to.match', /order\/create$/)
    })

    it('Should display search results to the user', () => {
      cy.signIn()

      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.ordersList().should('exist')
      indexPage.ordersListItems().should('exist').should('have.length', 2)

      indexPage.ordersListItems().eq(0).find('.govuk-link').should('contain', 'New form')

      indexPage
        .ordersListItems()
        .eq(0)
        .find('.govuk-tag')
        .should('have.class', 'govuk-tag--green')
        .should('contain', 'Submitted')

      indexPage.ordersListItems().eq(1).find('.govuk-link').should('contain', 'test tester')

      indexPage
        .ordersListItems()
        .eq(1)
        .find('.govuk-tag')
        .should('have.class', 'govuk-tag--grey')
        .should('contain', 'Draft')
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
      indexPage.ordersList().should('exist')
      indexPage.ordersListItems().should('exist').should('have.length', 1)
      indexPage.ordersListItems().eq(0).should('contain', 'No existing forms found.')
    })
  })
})
