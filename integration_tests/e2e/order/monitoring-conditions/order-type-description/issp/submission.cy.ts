import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import IsspPage from './isspPage'
import CheckYourAnswersPage from '../check-your-answers/CheckYourAnswersPage'

const mockOrderId = uuidv4()
context('order type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
    })
    cy.signIn()
  })

  it('Should show errors no answer selected', () => {
    const page = Page.visit(IsspPage, { orderId: mockOrderId })

    page.form.fillInWith('Yes')
    page.form.continueButton.click()
    // Update to Monitoring Dates page when added
    // Page.verifyOnPage(PilotPage)
    const cyaPage = Page.verifyOnPage(CheckYourAnswersPage, 'Check your answers')
    cyaPage.orderInformationSection.shouldExist()
    cyaPage.orderInformationSection.shouldHaveItem(
      'Is the device wearer on the Intensive Supervision and Surveillance Programme (ISSP)?',
      'Yes',
    )
  })
})
