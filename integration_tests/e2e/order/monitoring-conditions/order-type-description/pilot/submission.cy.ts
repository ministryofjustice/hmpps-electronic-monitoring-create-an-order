import { v4 as uuidv4 } from 'uuid'
import PilotPage from './PilotPage'
import Page from '../../../../../pages/page'
import PrarrPage from '../prarr/PrarrPage'

const stubGetOrder = (notifyingOrg: string = 'PROBATION') => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    order: {
      interestedParties: {
        notifyingOrganisation: notifyingOrg,
        notifyingOrganisationName: '',
        notifyingOrganisationEmail: 'notifying@organisation',
        responsibleOfficerName: '',
        responsibleOfficerPhoneNumber: '',
        responsibleOrganisation: 'PROBATION',
        responsibleOrganisationRegion: 'EAST_MIDLANDS',
        responsibleOrganisationEmail: 'responsible@organisation',
      },
    },
  })
}

const mockOrderId = uuidv4()
context('pilot', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    stubGetOrder()

    cy.signIn()

    const testFlags = {
      DAPOL_PILOT_PROBATION_REGIONS: 'KENT_SURREY_SUSSEX,WALES',
      LICENCE_VARIATION_PROBATION_REGIONS: 'YORKSHIRE_AND_THE_HUMBER,EAST_MIDLANDS',
    }

    cy.task('setFeatureFlags', testFlags)
  })

  it('Should submit the form', () => {
    const page = Page.visit(PilotPage, { orderId: mockOrderId })

    page.form.fillInWith('Licence Variation Project')
    const hintText =
      'The pilot is only for probation practitioners varying a licence in response to an escalation of risk or as an alternative to recall.'
    page.form.pilotField.element.contains(hintText)
    page.form.continueButton.click()

    Page.verifyOnPage(PrarrPage, 'Check your answers')
  })
})
