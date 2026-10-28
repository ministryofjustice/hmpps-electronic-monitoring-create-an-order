import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OrderTypePage from '../order-type/OrderTypePage'
import SentenceTypePage from './SentenceTypePage'
import HdcPage from '../hdc/hdcPage'
import PilotPage from '../pilot/PilotPage'
import PrarrPage from '../prarr/PrarrPage'
import MonitoringTypePage from '../monitoring-type/MonitoringTypesPage'
import HdcPausePage from '../hdc-pause/hdcPausePage'

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
      isSentencingAct: true,
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
  })

  it('Should submit the form and display the correct answers for a Post Release journey', () => {
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })

    orderTypePage.form.fillInWith('Release from prison')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Standard Determinate Sentence')
    sentenceTypePage.form.continueButton.click()

    const hdcPage = Page.verifyOnPage(HdcPage, { orderId: mockOrderId })
    hdcPage.form.fillInWith('Yes')
    hdcPage.form.continueButton.click()

    const hdcPausePage = Page.verifyOnPage(HdcPausePage)
    hdcPausePage.form.fillInWith('Yes')
    hdcPausePage.form.continueButton.click()

    const pilotPage = Page.verifyOnPage(PilotPage, { order: mockOrderId })
    pilotPage.form.fillInWith('Domestic Abuse Perpetrator on Licence (DAPOL)')
    pilotPage.form.continueButton.click()

    const prarrPage = Page.verifyOnPage(PrarrPage, { order: mockOrderId })
    prarrPage.form.fillInWith('Yes')
    prarrPage.form.continueButton.click()
  })

  it('Should submit the form and display the correct answers for a Community journey', () => {
    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: '/monitoring-conditions',
      response: {
        startDate: null,
        endDate: null,
        orderType: 'COMMUNITY',
        curfew: null,
        exclusionZone: null,
        trail: null,
        mandatoryAttendance: null,
        alcohol: null,
        conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
        orderTypeDescription: null,
        sentenceType: 'COMMUNITY_SDO',
        issp: null,
        hdc: null,
        prarr: null,
        pilot: null,
        offenceType: null,
        policeArea: null,
      },
    })

    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.fillInWith('Community')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Supervision Default Order')
    sentenceTypePage.form.continueButton.click()

    Page.verifyOnPage(MonitoringTypePage)
  })
})
