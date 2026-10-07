import { v4 as uuidv4 } from 'uuid'
import IndexPage from '../../pages/index'
import Page from '../../pages/page'

const mockOrderId = uuidv4()

context('Index', () => {
  context('Header', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubCemoListOrders')
      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      const testFlags = {
        TECHNOLOGY_PORTAL_PILOT_PRISONS: 'ABC',
      }

      cy.task('setFeatureFlags', testFlags)
    })
    afterEach(() => {
      cy.task('resetFeatureFlags')
    })

    it('Should have link to technology portal if user cohort is in pilot', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456785',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'PRISON', activeCaseLoadName: 'HMP ABC', activeCaseLoadId: 'ABC' },
      })
      cy.signIn()

      Page.visit(IndexPage)
      cy.get('.govuk-phase-banner__text')
        .contains('a', 'Report a problem (opens in a new tab)')
        .should('have.attr', 'href', 'https://mojprod.service-now.com/moj_sp')
    })

    it('Should have link to office form if user cohort is not in pilot', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456786',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'PRISON', activeCaseLoadName: 'HMP ABC', activeCaseLoadId: 'BCD' },
      })
      cy.signIn()

      Page.visit(IndexPage)
      cy.get('.govuk-phase-banner__text')
        .contains('a', 'Report a problem (opens in a new tab)')
        .should('have.attr', 'href', 'https://forms.office.com/e/czQvLP6DQq')
    })
  })

  context('Footer', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubCemoListOrders')
      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      const testFlags = {
        TECHNOLOGY_PORTAL_PILOT_PRISONS: 'ABC',
      }

      cy.task('setFeatureFlags', testFlags)
    })
    afterEach(() => {
      cy.task('resetFeatureFlags')
    })

    it('Should have link to technology portal if user cohort is in pilot', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456787',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'PRISON', activeCaseLoadName: 'HMP ABC', activeCaseLoadId: 'ABC' },
      })
      cy.signIn()

      Page.visit(IndexPage)
      cy.get('.govuk-footer__meta-item')
        .contains(
          'p',
          'If you are unable to fix the issue or there is something wrong with this page, contact the EMO support team by ',
        )
        .contains('a', 'reporting the problem (opens in new tab)')
        .should('have.attr', 'href', 'https://mojprod.service-now.com/moj_sp')
    })

    it('Should have link to office form if user cohort is not in pilot', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456788',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'PRISON', activeCaseLoadName: 'HMP ABC', activeCaseLoadId: 'BCD' },
      })
      cy.signIn()

      Page.visit(IndexPage)
      cy.get('.govuk-footer__meta-item')
        .contains(
          'p',
          'If you are unable to fix the issue or there is something wrong with this page, contact the EMO support team by ',
        )
        .contains('a', 'reporting the problem (opens in new tab)')
        .should('have.attr', 'href', 'https://forms.office.com/e/czQvLP6DQq')
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
