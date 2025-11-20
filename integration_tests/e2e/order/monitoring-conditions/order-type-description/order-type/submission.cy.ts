import { v4 as uuidv4 } from 'uuid'
import OrderTypePage from './OrderTypePage'
import Page from '../../../../../pages/page'
import SentenceTypePage from '../sentence-type/SentenceTypePage'
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
        responsibleOrganisation: 'HOME_OFFICE',
        responsibleOrganisationRegion: '',
        responsibleOrganisationEmail: '',
      },
    },
  })
}

const mockOrderId = uuidv4()
context('orderType', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    stubGetOrder()

    cy.signIn()
  })

  it('Should submit the form', () => {
    const page = Page.visit(OrderTypePage, { orderId: mockOrderId })

    page.form.fillInWith('Community')
    page.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(
      SentenceTypePage,
      'What type of sentence has the device wearer been given?',
    )
    sentenceTypePage.form.fillInWith('Supervision Default Order')
    sentenceTypePage.form.continueButton.click()

    Page.verifyOnPage(MonitoringTypePage)
  })
})
