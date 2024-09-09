import IndexPage from '../pages/index'
import Page from '../pages/page'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
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

  it('New form button should exist', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.newFormButton().should('exist')
  })

  it('New form button redirects user to new form page', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.newFormButton().click()
    cy.url().should('to.match', /newForm$/)
  })

  it('Search input and button should exist', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.searchInput().should('exist')
    indexPage.searchButton().should('exist')
  })

  // TODO: test search function working

  it('Form list should exist', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.formTable().should('exist')
    indexPage.formRow().should('exist')
  })
  // TODO: test form link

  // TODO: test pagination
})
