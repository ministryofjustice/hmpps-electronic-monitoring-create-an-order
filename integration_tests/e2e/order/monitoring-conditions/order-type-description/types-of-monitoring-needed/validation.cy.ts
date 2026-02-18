import { v4 as uuidv4 } from 'uuid'
import TypesOfMonitoringNeededPage from './TypesOfMonitoringNeededPage'
import Page from '../../../../../pages/page'

const mockOrderId = uuidv4()
context('typesOfMonitoringNeeded', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
    })

    cy.signIn()
  })

  it('validation errors', () => {
    const page = Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.saveAndContinueButton.click()

    page.errorSummary.shouldExist()
    page.form.addAnotherField.validationMessage.contains('Select Yes if there are other types of monitoring needed')
    page.errorSummary.shouldHaveError('Select Yes if there are other types of monitoring needed')
  })
})
