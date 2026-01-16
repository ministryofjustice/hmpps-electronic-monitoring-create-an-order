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

      // Sub nav
      page.subNav.should('exist')
      page.subNav.contains('Draft forms').should('have.attr', 'href', `/`)
      page.subNav.contains('Draft forms').should('have.attr', 'aria-current', 'page')
      page.subNav.contains('Submitted forms').should('have.attr', 'href', `/search`)
      page.subNav.contains('Submitted forms').should('not.have.attr', 'aria-current', `page`)

      // Order list
      page.orders.should('exist').should('have.length', 3)
      page.TableContains('test tester', 'Draft')
      page.IsAccesible('test tester', 0)
      page.TableContains('Failed request', 'Failed')
      page.IsAccesible('Failed request', 1)
      page.TableContains('vari ation', 'Change to form Draft')
      page.IsAccesible('vari ation', 2)

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

  context('User cohorts', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubCemoListOrders')
      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
    })

    it('Should show prison name if user is in Prison cohort', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456780',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'PRISON', activeCaseLoad: 'HMP ABC' },
      })
      cy.signIn()

      const page = Page.visit(IndexPage)
      page.header.cohort().should('contain.text', 'HMP ABC')
    })

    it('Should show probation as cohort if user is in probation cohort', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456781',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'PROBATION' },
      })

      cy.signIn()
      const page = Page.visit(IndexPage)
      page.header.cohort().should('contain.text', 'PROBATION')
    })

    it('Should show other as cohort if user is in other cohort', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456782',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'OTHER' },
      })

      cy.signIn()
      const page = Page.visit(IndexPage)
      page.header.cohort().should('contain.text', 'OTHER')
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
