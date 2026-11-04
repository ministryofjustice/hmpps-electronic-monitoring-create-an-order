import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import OffencePage from '../offences/offence/offencePage'
import RiskBehaviourPage from './RiskBehaviourPage'

const mockOrderId = uuidv4()
const apiPath = '/details-of-installation'

context('risk behaviour page when the other risk answers are complete', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        dataDictionaryVersion: 'DDV6',
        detailsOfInstallation: {
          riskCategory: ['THREATS_OF_VIOLENCE', 'DANGEROUS_ANIMALS'],
          riskDetails: '',
          genderRiskDetails: '',
        },
      },
    })
    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: apiPath,
      response: {
        riskCategory: ['THREATS_OF_VIOLENCE', 'SEXUAL_OFFENCES', 'DANGEROUS_ANIMALS'],
        riskDetails: '',
        genderRiskDetails: '',
      },
    })
    cy.signIn()
  })

  it('saves the changed answers and goes to the next task', () => {
    const page = Page.visit(RiskBehaviourPage, { orderId: mockOrderId })

    page.form.fillInWith('Sex offender')
    page.form.continueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${apiPath}`,
      body: {
        riskCategory: ['THREATS_OF_VIOLENCE', 'SEXUAL_OFFENCES', 'DANGEROUS_ANIMALS'],
        riskDetails: '',
        genderRiskDetails: '',
      },
    }).should('be.true')
    Page.verifyOnPage(OffencePage)
  })
})
