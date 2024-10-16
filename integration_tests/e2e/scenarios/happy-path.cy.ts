import Page from '../../pages/page'
import IndexPage from '../../pages/index'
import OrderSummaryPage from '../../pages/order/summary'

context('Scenarios', () => {
  context('Happy path', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', {
        name: 'Cemor Stubs',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER'],
      })

      cy.signIn()
    })

    it('Should submit an order to the Serco API', () => {
      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.newOrderFormButton().click()

      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
    })
  })
})
