import { v4 as uuidv4 } from 'uuid'

import Page from '../../../../pages/page'
import NationalSecurityDirectoratePage from './nationalSecurityDirectoratePage'
import SpecialOrderPage from '../../special-order/specialOrderPage'
import ProbationDeliveryUnitPage from '../probation-delivery-unit/probationDeliveryUnitPage'

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

  it('Should go to speical order hard stop page if answer is yes', () => {
    const page = Page.visit(NationalSecurityDirectoratePage, { orderId: mockOrderId })
    page.form.fillInWith('Yes')
    page.form.continueButton.click()

    Page.verifyOnPage(
      SpecialOrderPage,
      { orderId: mockOrderId },
      undefined,
      'About the Notifying and Responsible Organisations',
    )
  })

  it('Should go to pdu page if answer is no', () => {
    const page = Page.visit(NationalSecurityDirectoratePage, { orderId: mockOrderId })
    page.form.fillInWith('No')
    page.form.continueButton.click()

    Page.verifyOnPage(ProbationDeliveryUnitPage)
  })
})
