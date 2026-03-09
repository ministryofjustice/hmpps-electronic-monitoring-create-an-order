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

  it('Should display error when no answer provided', () => {
    const page = Page.visit(NationalSecurityDirectoratePage, { orderId: mockOrderId })
    page.form.continueButton.click()

    page.errorSummary.shouldExist()
    page.errorSummary.shouldHaveError('Select yes if the device wearer is being managed by the NSD')
    page.form.ndsField.validationMessage.contains('Select yes if the device wearer is being managed by the NSD')
  })
})
