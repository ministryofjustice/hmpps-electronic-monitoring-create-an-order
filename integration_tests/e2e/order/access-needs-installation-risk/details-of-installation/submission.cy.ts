import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import DetailsOfInstallationPage from './DetailsOfInstallationPage'
import InstallationAndRiskCheckYourAnswersPage from '../../../../pages/order/installation-and-risk/check-your-answers'

const mockOrderId = uuidv4()
const apiPath = '/details-of-installation'

context('details of installation page', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        dataDictionaryVersion: 'DDV6',
      },
    })

    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: apiPath,
      response: {
        riskCategory: ['THREATS_OF_VIOLENCE', 'SAFEGUARDING_CHILD'],
        riskDetails: 'some details',
      },
    })

    cy.signIn()
  })

  it('can submit an order', () => {
    const page = Page.visit(DetailsOfInstallationPage, { orderId: mockOrderId })

    page.form.fillInWith({
      possibleRisks: ['Violent behaviour or threats of violence'],
      riskCategories: ['Safeguarding child'],
      riskDetails: 'some details',
    })

    page.form.saveAndContinueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${apiPath}`,
      body: {
        riskCategory: ['THREATS_OF_VIOLENCE', 'SAFEGUARDING_CHILD'],
        riskDetails: 'some details',
      },
    }).should('be.true')

    Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answers')
  })
})
