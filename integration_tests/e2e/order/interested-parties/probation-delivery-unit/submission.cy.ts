import { v4 as uuidv4 } from 'uuid'
import ProbationDeliveryUnitPage from './probationDeliveryUnitPage'
import Page from '../../../../pages/page'
import InterestedPartiesCheckYourAnswersPage from '../check-your-answers/interestedPartiesCheckYourAnswersPage'

const mockOrderId = uuidv4()
context('probation delivery unit submission', () => {
  const submitPath = '/interested-parties'
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
          notifyingOrganisationEmail: 'notifying@organisation.com',
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
      method: 'PUT',
      response: {
        notifyingOrganisation: 'PRISON',
        responsibleOrganisation: 'PROBATION',
        probationDeliveryUnit: 'STAFFORDSHIRE_NORTH',
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
        notifyingOrganisation: 'PRISON',
        notifyingOrganisationName: 'FELTHAM_YOUNG_OFFENDER_INSTITUTION',
        notifyingOrganisationEmail: 'notifying@organisation.com',
        responsibleOrganisationEmail: 'responsible@organisation',
        responsibleOrganisation: 'PROBATION',
        responsibleOrganisationRegion: 'WEST_MIDLANDS',
        probationDeliveryUnit: 'STAFFORDSHIRE_NORTH',
      },
    }).should('be.true')

    Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)
  })

  // it('navigating back to the page after submission shows the previously saved pdu', () => {
  //   const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

  //   cy.task('stubCemoSubmitOrder', {
  //     httpStatus: 200,
  //     id: mockOrderId,
  //     subPath: submitPath,
  //     method: 'PUT',
  //     response: {
  //       notifyingOrganisation: 'PRISON',
  //       responsibleOrganisation: 'PROBATION',
  //       probationDeliveryUnit: 'STAFFORDSHIRE_SOUTH',
  //     },
  //   })

  //   page.form.fillInWith({
  //     unit: 'Staffordshire South',
  //   })

  //   page.form.saveAndContinueButton.click()

  //   cy.task('stubCemoVerifyRequestReceived', {
  //     uri: `/orders/${mockOrderId}${submitPath}`,
  //     body: {
  //       notifyingOrganisation: 'PRISON',
  //       notifyingOrganisationName: 'FELTHAM_YOUNG_OFFENDER_INSTITUTION',
  //       notifyingOrganisationEmail: 'notifying@organisation.com',
  //       responsibleOrganisationEmail: 'responsible@organisation',
  //       responsibleOrganisation: 'PROBATION',
  //       responsibleOrganisationRegion: 'WEST_MIDLANDS',
  //       probationDeliveryUnit: 'STAFFORDSHIRE_SOUTH',
  //     },
  //   }).should('be.true')

  //   Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)

  //   Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })
  //   page.form.unitField.shouldHaveValue('STAFFORDSHIRE_SOUTH')
  // })
})
