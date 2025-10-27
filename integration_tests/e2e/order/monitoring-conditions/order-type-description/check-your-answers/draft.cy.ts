import { v4 as uuidv4 } from 'uuid'
import CheckYourAnswersPage from './CheckYourAnswersPage'
import Page from '../../../../../pages/page'
import OrderTypePage from '../order-type/OrderTypePage'
import SentenceTypePage from '../sentence-type/SentenceTypePage'
import HdcPage from '../hdc/hdcPage'
import PilotPage from '../pilot/PilotPage'
import IsspPage from '../issp/isspPage'
import PrarrPage from '../prarr/PrarrPage'
import MonitoringTypesPage from '../monitoring-types/MonitoringTypesPage'
import MonitoringDatesPage from '../monitoring-dates/MonitoringDatesPage'

const mockOrderId = uuidv4()

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

context('Check your answers', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    stubGetOrder()
    cy.signIn()

    const testFlags = { DAPOL_PILOT_PROBATION_REGIONS: 'KENT_SURREY_SUSSEX,WALES' }

    cy.task('setFeatureFlags', testFlags)
  })

  const pageHeading = 'Check your answers'

  it('correct questions', () => {
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.fillInWith('Release from prison')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Standard Determinate Sentence')
    sentenceTypePage.form.continueButton.click()

    const hdcPage = Page.verifyOnPage(HdcPage, { orderId: mockOrderId })
    hdcPage.form.fillInWith('No')
    hdcPage.form.continueButton.click()

    const pilotPage = Page.verifyOnPage(PilotPage, { order: mockOrderId })
    pilotPage.form.fillInWith('Domestic Abuse Perpetrator on Licence (DAPOL)')
    pilotPage.form.continueButton.click()

    const prarrPage = Page.verifyOnPage(PrarrPage, { order: mockOrderId })
    prarrPage.form.fillInWith('Yes')
    prarrPage.form.continueButton.click()

    const monitoringDatesPage = Page.verifyOnPage(MonitoringDatesPage, { orderId: mockOrderId })
    monitoringDatesPage.form.fillInWith({
      startDate: { day: '10', month: '12', year: '2025' },
      endDate: { day: '11', month: '11', year: '2026' },
    })
    monitoringDatesPage.form.continueButton.click()

    const monitoringTypesPage = Page.verifyOnPage(MonitoringTypesPage, { order: mockOrderId })
    monitoringTypesPage.form.fillInWith('Alcohol')
    monitoringTypesPage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
    page.checkIsAccessible()

    page.orderInformationSection.shouldHaveItems([
      { key: 'What is the order type?', value: 'Post Release' },
      { key: 'What type of sentence has the device wearer been given?', value: 'Standard Determinate Sentence' },
      { key: 'Is the device wearer on a Home Detention Curfew (HDC)?', value: 'No' },
      {
        key: 'What pilot project is the device wearer part of?',
        value: 'Domestic Abuse Perpetrator on Licence (DAPOL)',
      },
      {
        key: 'Has the device wearer been released on a Presumptive Risk Assessed Release Review (P-RARR)?',
        value: 'Yes',
      },
      { key: 'What is the date for the first day of all monitoring?', value: '10/12/2025' },
      { key: 'What is the date when all monitoring ends?', value: '11/11/2026' },
      {
        key: 'What monitoring does the device wearer need?',
        value: 'Alcohol',
      },
    ])
  })

  it('Should display content for a Community order', () => {
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.orderTypeField.set('Community')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.sentenceTypeField.set('Supervision Default Order')
    sentenceTypePage.form.continueButton.click()

    const monitoringDatesPage = Page.verifyOnPage(MonitoringDatesPage, { orderId: mockOrderId })
    monitoringDatesPage.form.fillInWith({
      startDate: { day: '10', month: '12', year: '2025' },
      endDate: { day: '11', month: '11', year: '2026' },
    })
    monitoringDatesPage.form.continueButton.click()

    const monitoringTypesPage = Page.verifyOnPage(MonitoringTypesPage, { order: mockOrderId })
    monitoringTypesPage.form.fillInWith('Alcohol')
    monitoringTypesPage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.orderInformationSection.shouldExist()
    page.orderInformationSection.shouldHaveItems([
      { key: 'What is the order type?', value: 'Community' },
      { key: 'What type of sentence has the device wearer been given?', value: 'Supervision Default Order' },
      { key: 'What is the date for the first day of all monitoring?', value: '10/12/2025' },
      { key: 'What is the date when all monitoring ends?', value: '11/11/2026' },
      {
        key: 'What monitoring does the device wearer need?',
        value: 'Alcohol',
      },
    ])
  })

  it('Should display content for a DTO sentence type', () => {
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.orderTypeField.set('Release from prison')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.sentenceTypeField.set('Detention and Training Order (DTO)')
    sentenceTypePage.form.continueButton.click()

    const isspPage = Page.verifyOnPage(IsspPage, { orderId: mockOrderId })
    isspPage.form.fillInWith('Yes')
    isspPage.form.continueButton.click()

    const monitoringDatesPage = Page.verifyOnPage(MonitoringDatesPage, { orderId: mockOrderId })
    monitoringDatesPage.form.fillInWith({
      startDate: { day: '10', month: '12', year: '2025' },
      endDate: { day: '11', month: '11', year: '2026' },
    })
    monitoringDatesPage.form.continueButton.click()

    const monitoringTypesPage = Page.verifyOnPage(MonitoringTypesPage, { order: mockOrderId })
    monitoringTypesPage.form.fillInWith('Alcohol')
    monitoringTypesPage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.orderInformationSection.shouldExist()
    page.orderInformationSection.shouldHaveItems([
      { key: 'What is the order type?', value: 'Post Release' },
      { key: 'What type of sentence has the device wearer been given?', value: 'Detention and Training Order (DTO)' },
      { key: 'Is the device wearer on the Intensive Supervision and Surveillance Programme (ISSP)?', value: 'Yes' },
      { key: 'What is the date for the first day of all monitoring?', value: '10/12/2025' },
      { key: 'What is the date when all monitoring ends?', value: '11/11/2026' },
      {
        key: 'What monitoring does the device wearer need?',
        value: 'Alcohol',
      },
    ])
  })

  it('Should display content for a Bail order', () => {
    stubGetOrder('CROWN_COURT')
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.fillInWith('Bail')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.bailTypeField.set('Bail Supervision & Support')
    sentenceTypePage.form.continueButton.click()

    const isspPage = Page.verifyOnPage(IsspPage, { orderId: mockOrderId })
    isspPage.form.fillInWith('No')
    isspPage.form.continueButton.click()

    const monitoringDatesPage = Page.verifyOnPage(MonitoringDatesPage, { orderId: mockOrderId })
    monitoringDatesPage.form.fillInWith({
      startDate: { day: '5', month: '12', year: '2025' },
      endDate: { day: '11', month: '11', year: '2026' },
    })
    monitoringDatesPage.form.continueButton.click()

    const monitoringTypesPage = Page.verifyOnPage(MonitoringTypesPage, { order: mockOrderId })
    monitoringTypesPage.form.fillInWith('Alcohol')
    monitoringTypesPage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

    page.orderInformationSection.shouldHaveItems([
      { key: 'What is the order type?', value: 'Bail' },
      { key: 'What type of bail has the device wearer been given?', value: 'Bail Supervision & Support' },
      { key: 'Is the device wearer on the Intensive Supervision and Surveillance Programme (ISSP)?', value: 'No' },
      { key: 'What is the date for the first day of all monitoring?', value: '5/12/2025' },
      { key: 'What is the date when all monitoring ends?', value: '11/11/2026' },
      {
        key: 'What monitoring does the device wearer need?',
        value: 'Alcohol',
      },
    ])
  })

  it('Should not display order type if notifying org is prison', () => {
    stubGetOrder('PRISON')
    Page.visit(OrderTypePage, { orderId: mockOrderId })
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

    const monitoringDatesPage = Page.verifyOnPage(MonitoringDatesPage, { orderId: mockOrderId })
    monitoringDatesPage.form.fillInWith({
      startDate: { day: '10', month: '12', year: '2025' },
      endDate: { day: '11', month: '11', year: '2026' },
    })
    monitoringDatesPage.form.continueButton.click()

    const monitoringTypesPage = Page.verifyOnPage(MonitoringTypesPage, { order: mockOrderId })
    monitoringTypesPage.form.fillInWith('Alcohol')
    monitoringTypesPage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

    page.orderInformationSection.shouldNotHaveItem('What is the order type?')
    page.orderInformationSection.shouldHaveItems([
      { key: 'What type of sentence has the device wearer been given?', value: 'Standard Determinate Sentence' },
      { key: 'Is the device wearer on a Home Detention Curfew (HDC)?', value: 'Yes' },
      { key: 'What is the date for the first day of all monitoring?', value: '10/12/2025' },
      { key: 'What is the date when all monitoring ends?', value: '11/11/2026' },
      {
        key: 'What monitoring does the device wearer need?',
        value: 'Alcohol',
      },
    ])
  })

  it('should allow the user to change their answers', () => {
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.fillInWith('Release from prison')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Standard Determinate Sentence')
    sentenceTypePage.form.continueButton.click()

    const hdcPage = Page.verifyOnPage(HdcPage, { orderId: mockOrderId })
    hdcPage.form.fillInWith('No')
    hdcPage.form.continueButton.click()

    const pilotPage = Page.verifyOnPage(PilotPage, { order: mockOrderId })
    pilotPage.form.fillInWith('Domestic Abuse Perpetrator on Licence (DAPOL)')
    pilotPage.form.continueButton.click()

    const prarrPage = Page.verifyOnPage(PrarrPage, { order: mockOrderId })
    prarrPage.form.fillInWith('Yes')
    prarrPage.form.continueButton.click()

    const monitoringDatesPage = Page.verifyOnPage(MonitoringDatesPage, { orderId: mockOrderId })
    monitoringDatesPage.form.fillInWith({
      startDate: { day: '15', month: '12', year: '2025' },
      endDate: { day: '8', month: '10', year: '2027' },
    })
    monitoringDatesPage.form.continueButton.click()

    const monitoringTypesPage = Page.verifyOnPage(MonitoringTypesPage, { order: mockOrderId })
    monitoringTypesPage.form.fillInWith('Alcohol')
    monitoringTypesPage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
    page.changeLinkByQuestion('What type of sentence has the device wearer been given?').click()

    Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
  })

  it('should clear dependent answers when a previous answer is changed', () => {
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.fillInWith('Release from prison')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Standard Determinate Sentence')
    sentenceTypePage.form.continueButton.click()

    const hdcPage = Page.verifyOnPage(HdcPage, { orderId: mockOrderId })
    hdcPage.form.fillInWith('No')
    hdcPage.form.continueButton.click()

    const pilotPage = Page.verifyOnPage(PilotPage, { order: mockOrderId })
    pilotPage.form.fillInWith('Domestic Abuse Perpetrator on Licence (DAPOL)')
    pilotPage.form.continueButton.click()

    const prarrPage = Page.verifyOnPage(PrarrPage, { order: mockOrderId })
    prarrPage.form.fillInWith('Yes')
    prarrPage.form.continueButton.click()

    let monitoringDatesPage = Page.verifyOnPage(MonitoringDatesPage, { orderId: mockOrderId })
    monitoringDatesPage.form.fillInWith({
      startDate: { day: '10', month: '12', year: '2025' },
      endDate: { day: '11', month: '11', year: '2026' },
    })
    monitoringDatesPage.form.continueButton.click()

    let monitoringTypesPage = Page.verifyOnPage(MonitoringTypesPage, { order: mockOrderId })
    monitoringTypesPage.form.fillInWith('Alcohol')
    monitoringTypesPage.form.continueButton.click()

    let cyaPage = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
    cyaPage.changeLinkByQuestion('What is the order type?').click()

    stubGetOrder('HOME_OFFICE')
    Page.visit(OrderTypePage, { orderId: mockOrderId })

    monitoringDatesPage = Page.verifyOnPage(MonitoringDatesPage, { orderId: mockOrderId })
    monitoringDatesPage.form.fillInWith({
      startDate: { day: '08', month: '12', year: '2025' },
      endDate: { day: '10', month: '02', year: '2026' },
    })
    monitoringDatesPage.form.continueButton.click()

    monitoringTypesPage = Page.verifyOnPage(MonitoringTypesPage, { order: mockOrderId })
    monitoringTypesPage.form.fillInWith('Alcohol')
    monitoringTypesPage.form.continueButton.click()

    cyaPage = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
    cyaPage.orderInformationSection.shouldNotHaveItem('What type of sentence has the device wearer been given?')
    cyaPage.orderInformationSection.shouldNotHaveItem('What is the order type?')
    cyaPage.orderInformationSection.shouldNotHaveItem('Is the device wearer on a Home Detention Curfew (HDC)?')
    cyaPage.orderInformationSection.shouldNotHaveItem('What pilot project is the device wearer part of?')
    cyaPage.orderInformationSection.shouldNotHaveItem(
      'Has the device wearer been released on a Presumptive Risk Assessed Release Review (P-RARR)?',
    )
  })
})
