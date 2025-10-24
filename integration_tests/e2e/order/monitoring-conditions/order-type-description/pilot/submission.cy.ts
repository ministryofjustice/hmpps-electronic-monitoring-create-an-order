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
        notifyingOrganisationEmail: '',
        responsibleOfficerName: '',
        responsibleOfficerPhoneNumber: '',
        responsibleOrganisation: 'PROBATION',
        responsibleOrganisationRegion: 'KENT_SURREY_SUSSEX',
        responsibleOrganisationEmail: '',
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

    const testFlags = { DAPOL_PILOT_PROBATION_REGIONS: 'KENT_SURREY_SUSSEX,WALES' }

    cy.task('setFeatureFlags', testFlags)
  })

  it('Should submit the form', () => {
    const page = Page.visit(PilotPage, { orderId: mockOrderId })

    page.form.fillInWith('Domestic Abuse Perpetrator on Licence (DAPOL)')
    page.form.continueButton.click()

    Page.verifyOnPage(PrarrPage, 'Check your answers')
  })
})
