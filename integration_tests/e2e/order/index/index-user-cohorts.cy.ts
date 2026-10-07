import { v4 as uuidv4 } from 'uuid'
import IndexPage from '../../../pages/index'
import Page from '../../../pages/page'

const mockOrderId = uuidv4()

context('Index', () => {
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
        response: { cohort: 'PRISON', activeCaseLoadName: 'HMP ABC' },
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
      page.header.cohort().should('contain.text', 'Probation')
    })

    it('Should show Home Office as cohort if user is in HOME_OFFICE cohort', () => {
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
        response: { cohort: 'HOME_OFFICE' },
      })

      cy.signIn()
      const page = Page.visit(IndexPage)
      page.header.cohort().should('contain.text', 'Home Office')
    })

    it('Should show Court as cohort if user is in COURT cohort', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456783',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'COURT' },
      })

      cy.signIn()
      const page = Page.visit(IndexPage)
      page.header.cohort().should('contain.text', 'Court')
    })

    it('Should show other as cohort if user is in other cohort', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456784',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'OTHER' },
      })

      cy.signIn()
      const page = Page.visit(IndexPage)
      page.header.cohort().should('contain.text', 'Other')
    })
  })
})
