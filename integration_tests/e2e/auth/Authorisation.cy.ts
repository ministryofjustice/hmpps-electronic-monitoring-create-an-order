import IndexPage from '../../pages'
import AuthErrorPage from '../../pages/auth/auth-error'
import Page from '../../pages/page'

context('Authorisation', () => {
  beforeEach(() => {
    cy.task('reset')
  })

  context('Unauthorised user', () => {
    beforeEach(() => {
      cy.task('stubSignIn', { name: 'john smith', roles: [] })

      cy.signIn({ failOnStatusCode: false })
    })

    it('should be redirected to the authorisation error page', () => {
      Page.verifyOnPage(AuthErrorPage)
    })
  })

  context('Authenticated user', () => {
    beforeEach(() => {
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.signIn()
    })

    it('should be given access to service root', () => {
      Page.visit(IndexPage)
      Page.verifyOnPage(IndexPage)
    })

    it('should be able to create an order', () => {
      const page = Page.visit(IndexPage)
      page.newOrderFormButton().click()
    })
  })
})
