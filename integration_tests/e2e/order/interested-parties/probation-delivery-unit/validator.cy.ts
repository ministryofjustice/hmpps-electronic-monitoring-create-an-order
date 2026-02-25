import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import ProbationDeliveryUnitPage from './probationDeliveryUnitPage'

const mockOrderId = uuidv4()

context('Probation delivery unit validation', () => {
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
          // Your existing mock data
          responsibleOrganisation: 'PROBATION',
          responsibleOrganisationRegion: 'WEST_MIDLANDS',
        },
      },
    })

    cy.signIn()
  })

  it('Should display validation error messages when submitting an empty form', () => {
    const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

    page.form.saveAndContinueButton.click()
    Page.verifyOnPage(ProbationDeliveryUnitPage)

    page.errorSummary.shouldExist()
    page.errorSummary.shouldHaveError("Select the Responsible Organisation's PDU")
  })
})
