import { v4 as uuidv4 } from 'uuid'

import Page from '../../../../pages/page'
import NationalSecurityDirectoratePage from './nationalSecurityDirectoratePage'

const mockOrderId = uuidv4()
context('National security directorate page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
    })

    cy.signIn()
  })

  it('Page accessisble', () => {
    const page = Page.visit(NationalSecurityDirectoratePage, { orderId: mockOrderId })
    page.checkIsAccessible()
  })

  it('Should display content', () => {
    const page = Page.visit(NationalSecurityDirectoratePage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.ndsField.shouldExist()
    page.form.ndsField.shouldNotBeDisabled()
    page.form.ndsField.shouldHaveHint(
      'The National Security Directorate manage Critical Public Protection cases, Serious Organised Crime cases, those convicted of Terrorist Offences, or assessed as Terrorist Connected and Terrorist Risk cases',
    )

    page.form.continueButton.should('exist')
  })
})
