import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'

context('Interested parties flow', () => {
  let orderSummaryPage: OrderSummaryPage
  const testFlags = { INTERESTED_PARTIES_FLOW_ENABLED: true }

  beforeEach(() => {
    cy.task('setFeatureFlags', testFlags)
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER', 'ROLE_PRISON'],
    })
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.newOrderFormButton.click()

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.interestedPartiesTask.click()
  })

  it('Notifying organisation is court', () => {})

  it('Notifying organisation is Home Office', () => {})

  it('Notifying organisation is prison', () => {})

  it('Notifying organisation is probation', () => {})
})
