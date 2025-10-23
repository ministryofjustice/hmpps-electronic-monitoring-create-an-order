import { v4 as uuidv4 } from 'uuid'
import MonitoringTypesPage from './MonitoringTypesPage'
import Page from '../../../../../pages/page'
import HdcPage from '../hdc/hdcPage'
import PilotPage from '../pilot/PilotPage'
import OrderTypePage from '../order-type/OrderTypePage'
import SentenceTypePage from '../sentence-type/SentenceTypePage'

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
context('monitoring types', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    stubGetOrder()

    cy.signIn()

    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.fillInWith('Release from prison')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.visit(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Standard Determinate Sentence')
    sentenceTypePage.form.continueButton.click()
  })

  it('Page accessisble', () => {
    const page = Page.visit(MonitoringTypesPage, { orderId: mockOrderId })
    page.checkIsAccessible()
  })

  it('Should display content', () => {
    const page = Page.visit(MonitoringTypesPage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.monitoringTypesField.shouldExist()
    page.form.monitoringTypesField.shouldNotBeDisabled()
    page.form.monitoringTypesField.shouldHaveOption('Curfew')
    page.form.monitoringTypesField.shouldHaveOption('Exclusion zone monitoring')
    page.form.monitoringTypesField.shouldHaveOption('Trail monitoring')
    page.form.monitoringTypesField.shouldHaveOption('Mandatory attendance monitoring')
    page.form.monitoringTypesField.shouldHaveOption('Alcohol monitoring')

    page.form.continueButton.should('exist')
  })

  it('hdc no, pilot unknown', () => {
    const hdcPage = Page.visit(HdcPage, { orderId: mockOrderId })
    hdcPage.form.fillInWith('No')
    hdcPage.form.continueButton.click()

    const pilotPage = Page.verifyOnPage(PilotPage, { orderId: mockOrderId })
    pilotPage.form.fillInWith('They are not part of any of these pilots')
    pilotPage.form.continueButton.click()

    const monitoringTypesPage = Page.visit(MonitoringTypesPage, { orderId: mockOrderId })
    monitoringTypesPage.form.monitoringTypesField.optionIsDisabled('curfew')
    monitoringTypesPage.form.monitoringTypesField.optionIsDisabled('exclusionZone')
    monitoringTypesPage.form.monitoringTypesField.optionIsDisabled('trail')
    monitoringTypesPage.form.monitoringTypesField.optionIsDisabled('mandatoryAttendance')
    monitoringTypesPage.form.monitoringTypesField.optionIsEnabled('alcohol')
    monitoringTypesPage.form.message.contains(
      "Some monitoring types can't be selected because the device wearer is not part of any pilots.",
    )
  })

  it('hdc no, pilot unknown', () => {
    const hdcPage = Page.visit(HdcPage, { orderId: mockOrderId })
    hdcPage.form.fillInWith('No')
    hdcPage.form.continueButton.click()

    const pilotPage = Page.verifyOnPage(PilotPage, { orderId: mockOrderId })
    pilotPage.form.fillInWith('GPS acquisitive crime')
    pilotPage.form.continueButton.click()

    const monitoringTypesPage = Page.visit(MonitoringTypesPage, { orderId: mockOrderId })
    monitoringTypesPage.form.monitoringTypesField.optionIsDisabled('curfew')
    monitoringTypesPage.form.monitoringTypesField.optionIsDisabled('exclusionZone')
    monitoringTypesPage.form.monitoringTypesField.optionIsEnabled('trail')
    monitoringTypesPage.form.monitoringTypesField.optionIsDisabled('mandatoryAttendance')
    monitoringTypesPage.form.monitoringTypesField.optionIsDisabled('alcohol')
    monitoringTypesPage.form.message.contains(
      "Some monitoring types can't be selected because the device wearer is not on a Home Detention Curfew (HDC).",
    )
  })
})
