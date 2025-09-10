import { v4 as uuidv4 } from 'uuid'
import IndexPage from '../pages/index'
import OrderTasksPage from '../pages/order/summary'
import Page from '../pages/page'
import SearchPage from '../pages/search'

const mockOrderId = uuidv4()

context('Index', () => {
  context('Viewing the order list', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.signIn()
    })

    it('Should render the correct elements ', () => {
      // Visit the home page
      const page = Page.visit(IndexPage)

      // Header
      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')

      // Create buttons
      page.newOrderFormButton.should('exist')
      page.newVariationFormButton.should('exist')

      // Sub nav
      page.subNav.should('exist')
      page.subNav.contains('Draft forms').should('have.attr', 'href', `/`)
      page.subNav.contains('Draft forms').should('have.attr', 'aria-current', 'page')
      page.subNav.contains('Submitted forms').should('have.attr', 'href', `/search`)
      page.subNav.contains('Submitted forms').should('not.have.attr', 'aria-current', `page`)

      // Order list
      page.orders.should('exist').should('have.length', 4)
      page.TableContains('Not supplied', 'Submitted')
      page.IsAccesible('Not supplied', 0)
      page.TableContains('test tester', 'Draft')
      page.IsAccesible('test tester', 1)
      page.TableContains('Failed request', 'Failed')
      page.IsAccesible('Failed request', 2)
      page.TableContains('vari ation', 'Change to form Draft')
      page.IsAccesible('vari ation', 3)

      // A11y
      page.checkIsAccessible()
    })

    it('navigates to the index page when we click the draft forms nav link', () => {
      const page = Page.visit(IndexPage)

      page.subNav.contains('Draft forms').should('have.attr', 'href', `/`)

      Page.verifyOnPage(IndexPage)
    })
  })

  context('Submitting a create order request', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', type: 'REQUEST' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.signIn()
    })

    it('should create a new order', () => {
      // Visit the home page
      const page = Page.visit(IndexPage)

      // Create a new order
      page.newOrderFormButton.click()

      // Verify the api was called correctly
      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders`,
        method: 'POST',
        body: {
          type: 'REQUEST',
        },
      }).should('be.true')

      // Verify the user was redirected to the task page
      Page.verifyOnPage(OrderTasksPage)
    })
  })

  context('Submitting a create variation request', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', type: 'VARIATION' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.signIn()
    })

    it('should create a new variation', () => {
      // Visit the home page
      const page = Page.visit(IndexPage)

      // Create a new variation
      page.newVariationFormButton.click()

      // Verify the api was called correctly
      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders`,
        method: 'POST',
        body: {
          type: 'VARIATION',
        },
      }).should('be.true')

      // Verify the user was redirected to the task page
      Page.verifyOnPage(OrderTasksPage)
    })
  })

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

      page.subNav.contains('Submitted forms').click()

      Page.verifyOnPage(SearchPage)
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
      indexPage.ordersList.get('.govuk-table__body').should('not.exist')
      cy.contains('You have no draft forms').should('exist')
    })
  })
})
