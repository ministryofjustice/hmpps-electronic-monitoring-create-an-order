import { v4 as uuidv4 } from 'uuid'
import OffenceTypePage from './OffenceTypePage'
import Page from '../../../../../pages/page'
import PoliceAreaPage from '../police-area/PoliceAreaPage'

const mockOrderId = uuidv4()
context('offence type', () => {
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
    const page = Page.visit(OffenceTypePage, { orderId: mockOrderId })

    page.form.fillInWith('Burglary in a Dwelling - Indictable only')
    page.form.continueButton.click()

    Page.verifyOnPage(PoliceAreaPage)
  })
})
