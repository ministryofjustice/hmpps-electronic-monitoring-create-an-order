import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import TypesOfMonitoringNeededPage from './TypesOfMonitoringNeededPage'

const mockOrderId = uuidv4()
const condition = {
  monitoringType: 'ALCOHOL_LEVEL',
  startDate: '2025-01-01T00:00:00Z',
  endDate: '2025-02-01T00:00:00Z',
}
const defaultDeviceWearer = {
  nomisId: '',
  pncId: null,
  deliusId: null,
  prisonNumber: null,
  homeOfficeReferenceNumber: null,
  complianceAndEnforcementPersonReference: null,
  courtCaseReferenceNumber: null,
  firstName: 'Joe',
  lastName: 'Bloggs',
  alias: null,
  dateOfBirth: null,
  adultAtTimeOfInstallation: true,
  sex: null,
  gender: null,
  disabilities: '',
  noFixedAbode: false,
  interpreterRequired: null,
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
      ...order,
    },
  })
}

context('Types of monitoring needed - ineligible monitoring conditions', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.signIn()
  })

  const shouldBlockSaving = (message: string) => {
    const page = Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })

    cy.get('[data-qa="ineligible-monitoring-banner"]').should('contain.text', message)
    cy.get('[data-qa="ineligible-monitoring-banner"]').should('contain.text', 'You must:')
    page.form.saveAndContinueButton.should('be.disabled')
    page.form.saveAsDraftButton.should('be.disabled')
  }

  it('shows the no fixed address message when a non Home Office order has trail monitoring', () => {
    stubGetOrder({
      deviceWearer: { ...defaultDeviceWearer, noFixedAbode: true, adultAtTimeOfInstallation: true },
      interestedParties: { notifyingOrganisation: 'PRISON' },
      monitoringConditionsTrail: condition,
    })

    shouldBlockSaving('The device wearer has no fixed address so only Alcohol monitoring is allowed.')
  })

  it('shows the Home Office message when a Home Office order has curfew', () => {
    stubGetOrder({
      deviceWearer: { ...defaultDeviceWearer, noFixedAbode: true, adultAtTimeOfInstallation: true },
      interestedParties: { notifyingOrganisation: 'HOME_OFFICE' },
      curfewConditions: { ...condition, curfewAddress: null, curfewAdditionalDetails: null },
    })

    shouldBlockSaving(
      'The device wearer has no fixed address so only Trail, Exclusion and Alcohol monitoring is allowed.',
    )
  })

  it('shows the youth message when the device wearer is a youth with alcohol monitoring', () => {
    stubGetOrder({
      deviceWearer: { ...defaultDeviceWearer, noFixedAbode: false, adultAtTimeOfInstallation: false },
      interestedParties: { notifyingOrganisation: 'PRISON' },
      monitoringConditionsAlcohol: condition,
    })

    shouldBlockSaving('Alcohol monitoring is not allowed because the device wearer is a youth.')
  })

  it('does not show the banner or block the buttons for an eligible order', () => {
    stubGetOrder({
      deviceWearer: { ...defaultDeviceWearer, noFixedAbode: true, adultAtTimeOfInstallation: true },
      interestedParties: { notifyingOrganisation: 'PRISON' },
      monitoringConditionsAlcohol: condition,
    })

    const page = Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })

    cy.get('[data-qa="ineligible-monitoring-banner"]').should('not.exist')
    page.form.saveAndContinueButton.should('not.be.disabled')
    page.form.saveAsDraftButton.should('not.be.disabled')
  })
})
