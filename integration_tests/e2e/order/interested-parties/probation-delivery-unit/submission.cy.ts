import { v4 as uuidv4 } from 'uuid'
import ProbationDeliveryUnitPage from './probationDeliveryUnitPage'
import Page from '../../../../pages/page'
import InterestedPartiesCheckYourAnswersPage from '../check-your-answers/interestedPartiesCheckYourAnswersPage'

const mockOrderId = uuidv4()
context('probation delivery unit submission', () => {
  const submitPath = '/probation-delivery-unit'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        dataDictionaryVersion: 'DDV6',
        interestedParties: {
          notifyingOrganisation: 'PRISON',
          notifyingOrganisationName: 'FELTHAM_YOUNG_OFFENDER_INSTITUTION',
          notifyingOrganisationEmail: 'notifying@organisation',
          responsibleOrganisationEmail: 'responsible@organisation',
          responsibleOrganisation: 'PROBATION',
          responsibleOrganisationRegion: 'WEST_MIDLANDS',
        },
      },
    })

    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: submitPath,
      response: {
        unit: 'STAFFORDSHIRE_NORTH',
      },
    })

    cy.signIn()
  })

  it('successfully submits a probation delivery unit and routes to CYA page', () => {
    const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

    page.form.fillInWith({
      unit: 'Staffordshire North',
    })

    page.form.saveAndContinueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${submitPath}`,
      body: {
        unit: 'STAFFORDSHIRE_NORTH',
      },
    }).should('be.true')

    Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)
  })

  it('navigating back to the page after submission shows the previously saved pdu', () => {
    const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: submitPath,
      response: {
        unit: 'STAFFORDSHIRE_SOUTH',
      },
    })

    page.form.fillInWith({
      unit: 'Staffordshire South',
    })

    page.form.saveAndContinueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${submitPath}`,
      body: {
        unit: 'STAFFORDSHIRE_SOUTH',
      },
    }).should('be.true')

    Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)

    page.backButton.click()
    page.form.unitField.shouldHaveValue('Staffordshire South')
  })
})
