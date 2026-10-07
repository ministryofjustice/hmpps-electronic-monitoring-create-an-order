import { v4 as uuidv4 } from 'uuid'
import IndexPage from '../../../pages/index'
import Page from '../../../pages/page'
import SearchPage from '../../../pages/search'

const mockOrderId = uuidv4()

context('Index', () => {
  context('Search for submitted form request', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', type: 'VARIATION' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.signIn()
    })

    it('should navigate to the search page', () => {
      const page = Page.visit(IndexPage)

      page.subNav.contains('Search for a form').click()

      Page.verifyOnPage(SearchPage)
    })
  })
})
