import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import IsMappaPage from './IsMappaPage'

const mockOrderId = uuidv4()
context('dapo order clause', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
    })

    cy.signIn()
  })

  it('shows the correct errors', () => {
    const page = Page.visit(IsMappaPage, { orderId: mockOrderId })

    page.form.saveAndContinueButton.click()

    page.form.isMappaField.shouldHaveValidationMessage('Select Yes if the device wearer is a MAPPA offender')
  })
})
