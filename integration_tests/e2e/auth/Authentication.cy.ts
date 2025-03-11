import IndexPage from '../../pages/index'
import AuthSignInPage from '../../pages/auth/signIn'
import Page from '../../pages/page'
import AuthManageDetailsPage from '../../pages/auth/manageDetails'
import StartPage from '../../pages/order/start'

context('Authentication', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoListOrders', [])
  })

  context('Unauthenticated user', () => {
    it('is asked to authenticate when navigating to service root', () => {
      cy.visit('/')

      Page.verifyOnPage(StartPage)
    })

    it('is asked to authenticate when navigating to sign in', () => {
      cy.visit('/sign-in')

      Page.verifyOnPage(AuthSignInPage)
    })

    it('is asked to authenticate when navigating to unknown page', () => {
      cy.visit('/path-not-handled-by-router')

      Page.verifyOnPage(StartPage)
    })

    it('is directed to the index page on successfully completing authentication', () => {
      cy.signIn()

      Page.verifyOnPage(IndexPage)
    })
  })

  context('Authenticated user', () => {
    beforeEach(() => {
      cy.signIn()
    })

    it('can sign out', () => {
      const indexPage = Page.visit(IndexPage)

      indexPage.header.signOut().click()

      Page.verifyOnPage(AuthSignInPage)
    })

    it('can manage their details', () => {
      cy.task('stubAuthManageDetails')

      const indexPage = Page.visit(IndexPage)

      // guard to stop page opening in new window
      indexPage.header.manageDetails().get('a').invoke('removeAttr', 'target')
      indexPage.header.manageDetails().click()

      Page.verifyOnPage(AuthManageDetailsPage)
    })
  })

  context('On token verification failure', () => {
    beforeEach(() => {
      cy.task('stubUnverifiableSignIn', { name: 'Jane austin', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubVerifyToken', false)
      cy.signIn()
    })

    it('takes user to sign in page', () => {
      // can't do a visit here as cypress requires only one domain
      cy.request('/')

      Page.verifyOnPage(StartPage)
    })

    it('clears user session', () => {
      // can't do a visit here as cypress requires only one domain
      cy.request('/')

      Page.verifyOnPage(StartPage)

      cy.task('stubSignIn', { name: 'bobby brown', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.signIn()

      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.header.userName().contains('B. Brown')
    })
  })
})
