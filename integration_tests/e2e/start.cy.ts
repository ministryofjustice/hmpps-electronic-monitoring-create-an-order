import StartPage from '../pages/order/start'
import Page from '../pages/page'

context('Start', () => {
  context('Should render start page', () => {
    beforeEach(() => {
      cy.task('reset')
    })

    it('Should render the correct elements ', () => {
      const page = Page.visit(StartPage)
      page.signInButton().should('exist')
    })
  })
})
