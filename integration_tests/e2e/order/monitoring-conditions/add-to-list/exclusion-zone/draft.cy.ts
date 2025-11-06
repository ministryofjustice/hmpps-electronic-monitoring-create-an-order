import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import EnforcementZonePage from './ExclusionZonePage'

const mockOrderId = uuidv4()

context('Monitoring conditions - Enforcement Zone', () => {
  context('Page content', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.signIn()
    })

    it('Map tool should open in a new tab', () => {
      const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId })
      page.mapToolOpensInNewTab()
    })
  })

  context('Draft order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.signIn()
    })

    it('Should display contents', () => {
      const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId })
      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')

      page.form.saveAndContinueButton.should('exist')
      page.form.saveAsDraftButton.should('exist')
      page.backButton.should('exist')
      page.errorSummary.shouldNotExist()
      page.form.nameField.element.should('exist')

      page.checkIsAccessible()
    })
  })

  context('Submitted Order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'SUBMITTED' })

      cy.signIn()
    })

    it('Should not allow the user to update the enforcement zone details', () => {
      const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId })

      // Verify the correct buttons are displayed
      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAsDraftButton.should('not.exist')
      page.backButton.should('exist').should('have.attr', 'href', '#')

      // Verify all form elements are disabled
      page.form.shouldBeDisabled()
      page.errorSummary.shouldNotExist()
    })
  })
})
