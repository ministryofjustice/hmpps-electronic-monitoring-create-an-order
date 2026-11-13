import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import TypesOfMonitoringNeededPage from './TypesOfMonitoringNeededPage'
import TrailMonitoringPage from '../../../../../pages/order/monitoring-conditions/trail-monitoring'

const mockOrderId = uuidv4()

const dates = { startDate: '2030-01-01T00:00:00Z', endDate: '2030-02-01T00:00:00Z' }

const completeAlcohol = { id: 'alcoholId', monitoringType: 'ALCOHOL_LEVEL', ...dates }
const incompleteTrail = { id: 'trailId', startDate: dates.startDate, endDate: null }
const completeTrail = { id: 'trailId', ...dates }

const incompleteAttendance = {
  id: 'attendanceId',
  ...dates,
  purpose: 'Meeting',
  appointmentDay: null,
  startTime: null,
  endTime: null,
  addressLine1: null,
  addressLine2: null,
  addressLine3: null,
  addressLine4: null,
  postcode: null,
}

const incompleteExclusionZone = {
  id: 'zoneId',
  zoneType: 'EXCLUSION',
  ...dates,
  name: 'Zone one',
  description: null,
  duration: null,
  fileName: null,
  fileId: null,
  zoneId: 1,
}

const stubGetOrder = (order: Record<string, unknown>) => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    status: 'IN_PROGRESS',
    order: {
      dataDictionaryVersion: 'DDV7',
      curfewConditions: null,
      monitoringConditionsTrail: null,
      enforcementZoneConditions: [],
      mandatoryAttendanceConditions: [],
      monitoringConditionsAlcohol: null,
      interestedParties: { notifyingOrganisation: 'PRISON' },
      ...order,
    },
  })
}

context('Types of monitoring needed - incomplete monitoring types', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.signIn()
  })

  it('does not show a tag or disable the buttons when every monitoring type is complete', () => {
    stubGetOrder({ monitoringConditionsAlcohol: completeAlcohol, monitoringConditionsTrail: completeTrail })

    const page = Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })

    cy.get('.govuk-summary-list .govuk-tag').should('not.exist')
    page.form.saveAndContinueButton.should('not.be.disabled')
    page.form.saveAsDraftButton.should('not.be.disabled')
  })

  it('shows a blue Incomplete tag and disables both buttons for an incomplete monitoring type', () => {
    stubGetOrder({ monitoringConditionsTrail: incompleteTrail })

    const page = Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })

    cy.get('.govuk-summary-list .govuk-tag')
      .should('have.length', 1)
      .and('have.class', 'govuk-tag--blue')
      .and('have.text', 'Incomplete')
    page.form.saveAndContinueButton.should('be.disabled')
    page.form.saveAsDraftButton.should('be.disabled')
  })

  it('places the tag in the value cell, before the row actions', () => {
    stubGetOrder({ monitoringConditionsTrail: incompleteTrail })

    Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })

    cy.get('.govuk-summary-list__row').within(() => {
      cy.get('.govuk-summary-list__value .govuk-tag').should('have.text', 'Incomplete')
      cy.get('.govuk-summary-list__actions').should('contain.text', 'Change').and('not.contain.text', 'Incomplete')
    })
  })

  it('removes the tag and re-enables both buttons once the user fixes the item via Change', () => {
    stubGetOrder({ monitoringConditionsTrail: incompleteTrail })
    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: '/monitoring-conditions-trail',
      response: completeTrail,
    })

    const typesPage = Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })
    cy.get('.govuk-summary-list .govuk-tag').should('have.text', 'Incomplete')
    typesPage.form.saveAndContinueButton.should('be.disabled')
    typesPage.form.saveAsDraftButton.should('be.disabled')

    cy.contains('.govuk-summary-list__row', 'Trail monitoring').contains('a', 'Change').click()
    const trailPage = Page.verifyOnPage(TrailMonitoringPage)

    stubGetOrder({ monitoringConditionsTrail: completeTrail })
    trailPage.form.fillInWith({ endDate: new Date(2030, 1, 1) })
    trailPage.form.saveAndContinueButton.click()

    const returnedPage = Page.verifyOnPage(TypesOfMonitoringNeededPage)
    cy.get('.govuk-summary-list .govuk-tag').should('not.exist')
    returnedPage.form.saveAndContinueButton.should('not.be.disabled')
    returnedPage.form.saveAsDraftButton.should('not.be.disabled')
  })

  it('only tags the incomplete monitoring types', () => {
    stubGetOrder({ monitoringConditionsAlcohol: completeAlcohol, monitoringConditionsTrail: incompleteTrail })

    const page = Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })

    cy.get('.govuk-summary-list .govuk-tag').should('have.length', 1)
    cy.contains('.govuk-summary-list__row', 'Trail monitoring').find('.govuk-tag').should('exist')
    cy.contains('.govuk-summary-list__row', 'Alcohol monitoring').find('.govuk-tag').should('not.exist')
    page.form.saveAndContinueButton.should('be.disabled')
  })

  it('tags incomplete mandatory attendance and exclusion zone monitoring', () => {
    stubGetOrder({
      mandatoryAttendanceConditions: [incompleteAttendance],
      enforcementZoneConditions: [incompleteExclusionZone],
    })

    Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })

    cy.contains('.govuk-summary-list__row', 'Mandatory attendance monitoring').find('.govuk-tag').should('exist')
    cy.contains('.govuk-summary-list__row', 'Exclusion zone monitoring').find('.govuk-tag').should('exist')
  })

  it('applies the Home Office rules: a device type is required, an end date is not', () => {
    stubGetOrder({
      interestedParties: { notifyingOrganisation: 'HOME_OFFICE' },
      monitoringConditionsTrail: { id: 'trailId', startDate: dates.startDate, endDate: null },
    })
    Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })
    cy.get('.govuk-summary-list .govuk-tag').should('have.text', 'Incomplete')

    stubGetOrder({
      interestedParties: { notifyingOrganisation: 'HOME_OFFICE' },
      monitoringConditionsTrail: { id: 'trailId', startDate: dates.startDate, endDate: null, deviceType: 'FITTED' },
    })
    Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })
    cy.get('.govuk-summary-list .govuk-tag').should('not.exist')
  })
})
