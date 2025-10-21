import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OrderTypePage from '../order-type/OrderTypePage'
import SentenceTypePage from './SentenceTypePage'
import HdcPage from '../hdc/hdcPage'
import CheckYourAnswersPage from '../check-your-answers/CheckYourAnswersPage'
import PilotPage from '../pilot/PilotPage'
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
        responsibleOrganisation: 'HOME_OFFICE',
        responsibleOrganisationRegion: '',
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

    const pilotPage = Page.verifyOnPage(PilotPage, { order: mockOrderId })
    pilotPage.form.fillInWith('Domestic Abuse Perpetrator on Licence (DAPOL)')
    pilotPage.form.continueButton.click()

    const prarrPage = Page.verifyOnPage(PrarrPage, { order: mockOrderId })
    prarrPage.form.fillInWith('Yes')
    prarrPage.form.continueButton.click()

    const cyaPage = Page.verifyOnPage(CheckYourAnswersPage, 'Check your answers')
    cyaPage.orderInformationSection.shouldExist()
    cyaPage.orderInformationSection.shouldHaveItems([
      { key: 'What is the order type?', value: 'Post Release' },
      { key: 'What type of sentence has the device wearer been given?', value: 'Standard Determinate Sentence' },
      { key: 'Is the device wearer on a Home Detention Curfew (HDC)?', value: 'Yes' },
    ])
  })

  it('Should submit the form and display the correct answers for a Community journey', () => {
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.fillInWith('Community')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Supervision Default Order')
    sentenceTypePage.form.continueButton.click()

    // TODO: Update this journey when the Monitoring Dates page is built
    const cyaPage = Page.verifyOnPage(CheckYourAnswersPage, 'Check your answers')
    cyaPage.orderInformationSection.shouldHaveItems([
      { key: 'What is the order type?', value: 'Community' },
      { key: 'What type of sentence has the device wearer been given?', value: 'Supervision Default Order' },
    ])
  })
})
