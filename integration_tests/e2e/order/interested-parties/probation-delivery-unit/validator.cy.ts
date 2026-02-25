import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import ProbationDeliveryUnitPage from './probationDeliveryUnitPage'

const mockOrderId = uuidv4()

context('probation delivery unit validation', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      order: {
        dataDictionaryVersion: 'DDV6',
        interestedParties: {
          responsibleOrganisation: 'PROBATION',
        },
      },
    })

    cy.signIn()
  })

  it('Should display validation error messages when submitting an empty form', () => {
    const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

    page.form.continueButton.click()
    Page.verifyOnPage(ProbationDeliveryUnitPage)
    
    page.form.unitField.shouldHaveValidationMessage("Select the Responsible Organisation's PDU")
    page.errorSummary.shouldExist()
    page.errorSummary.shouldHaveError("Select the Responsible Organisation's PDU")
  })
})