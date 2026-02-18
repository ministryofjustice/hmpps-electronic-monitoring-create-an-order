import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OrderTypePage from '../order-type/OrderTypePage'
import SentenceTypePage from './SentenceTypePage'
import HdcPage from '../hdc/hdcPage'
import PilotPage from '../pilot/PilotPage'
import PrarrPage from '../prarr/PrarrPage'
import MonitoringTypePage from '../monitoring-type/MonitoringTypesPage'

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
context('sentenceType form submission', () => {
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

  it('Should submit the form and display the correct answers for a Post Release journey', () => {
    Page.visit(OrderTypePage, { orderId: mockOrderId })
    // orderTypePage.form.fillInWith('Release from prison')
    // orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Standard Determinate Sentence')
    sentenceTypePage.form.continueButton.click()

    const hdcPage = Page.verifyOnPage(HdcPage, { orderId: mockOrderId })
    hdcPage.form.fillInWith('Yes')
    hdcPage.form.continueButton.click()

    const pilotPage = Page.verifyOnPage(PilotPage, { order: mockOrderId })
    pilotPage.form.fillInWith('Domestic Abuse Perpetrator on Licence (DAPOL)')
    pilotPage.form.continueButton.click()

    const prarrPage = Page.verifyOnPage(PrarrPage, { order: mockOrderId })
    prarrPage.form.fillInWith('Yes')
    prarrPage.form.continueButton.click()
  })

  // Order type communities disabled ELM-4495 skipping test until the option is enabled again
  it.skip('Should submit the form and display the correct answers for a Community journey', () => {
    Page.visit(OrderTypePage, { orderId: mockOrderId })
    // orderTypePage.form.fillInWith('Community')
    // orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Supervision Default Order')
    sentenceTypePage.form.continueButton.click()

    Page.verifyOnPage(MonitoringTypePage)
  })
})
