import AuthErrorPage from '../pages/authError'
import Page from '../pages/page'

context('Unauthorised sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: [] })
  })

  it('should redirect to /authError for an unauthorised user', () => {
    cy.signIn({ failOnStatusCode: false })
    const indexPage = Page.verifyOnPage(AuthErrorPage)
    indexPage.errorMessage().should('contain.text', 'You are not authorised to use this application.')
  })
})
