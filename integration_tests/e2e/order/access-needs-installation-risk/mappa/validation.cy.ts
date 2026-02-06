import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import MappaPage from './MappaPage'

const mockOrderId = uuidv4()
context('mappa validation', () => {
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
    const page = Page.visit(MappaPage, { orderId: mockOrderId })

    page.form.saveAndContinueButton.click()

    page.form.levelField.shouldHaveValidationMessage('Select the level of MAPPA that applies to the device wearer')
    page.form.categoryField.shouldHaveValidationMessage(
      'Select the category of MAPPA that applies to the device wearer',
    )
  })
})
