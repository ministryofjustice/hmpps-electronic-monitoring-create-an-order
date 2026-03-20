import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import NotifyingOrganisationPage from './notifyingOrganisationPage'

const mockOrderId = uuidv4()
context('notifying organisation page', () => {
  beforeEach(() => {
    cy.task('reset')

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        dataDictionaryVersion: 'DDV6',
      },
    })
  })

  describe('when user cohort is other', () => {
    it('has all radio buttons', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '111',
      })

      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'OTHER' },
      })

      cy.signIn()

      const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

      page.form.organisationField.shouldExist()
      page.form.organisationField.shouldHaveAllOptions()

      page.form.emailField.shouldExist()

      page.form.continueButton.should('exist')
    })
  })

  describe('when user cohort is prison', () => {
    it('only has prison and ycs radio buttons', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '222',
      })

      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'PRISON', activeCaseLoadName: 'HMP ABC' },
      })

      cy.signIn()

      const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

      page.form.organisationField.shouldExist()
      page.form.organisationField.shouldHaveOption('Prison service')
      page.form.organisationField.shouldHaveOption('Youth Custody Service (YCS)')
      page.form.organisationField.shouldNotHaveOption('Probation service')
      page.form.organisationField.shouldNotHaveOption('Crown Court')
      page.form.organisationField.shouldNotHaveOption('Magistrates Court')
      page.form.organisationField.shouldNotHaveOption('Family Court')
      page.form.organisationField.shouldNotHaveOption('Civil and County Court')
      page.form.organisationField.shouldNotHaveOption('Youth Court')
      page.form.organisationField.shouldNotHaveOption('Scottish Court')
      page.form.organisationField.shouldNotHaveOption('Military Court')
      page.form.organisationField.shouldNotHaveOption('Home Office')

      page.form.emailField.shouldExist()

      page.form.continueButton.should('exist')
    })
  })

  describe('when user cohort is probation', () => {
    it('has no radio buttons for notifying org as inferred from auth', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '333',
      })

      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'PROBATION' },
      })

      cy.signIn()

      const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

      cy.get('form').should('not.contain', 'What organisation or related organisation are you part of?')

      page.form.emailField.shouldExist()

      page.form.continueButton.should('exist')
    })
  })
})
