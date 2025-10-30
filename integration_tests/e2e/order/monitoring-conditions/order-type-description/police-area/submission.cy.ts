import { v4 as uuidv4 } from 'uuid'
import PoliceAreaPage from './PoliceAreaPage'
import Page from '../../../../../pages/page'
import PrarrPage from '../prarr/PrarrPage'

const mockOrderId = uuidv4()
context('police area', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
    })

    cy.signIn()
  })

  it('Should submit the form', () => {
    const page = Page.visit(PoliceAreaPage, { orderId: mockOrderId })

    page.form.fillInWith('Essex')
    page.form.continueButton.click()

    Page.verifyOnPage(PrarrPage)
  })
})
