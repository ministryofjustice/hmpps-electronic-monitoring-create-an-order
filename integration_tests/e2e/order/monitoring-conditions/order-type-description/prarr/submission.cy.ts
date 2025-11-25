import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import PrarrPage from './PrarrPage'
import MonitoringTypePage from '../monitoring-type/MonitoringTypesPage'
import { MonitoringConditions } from '../../../../../../server/routes/monitoring-conditions/model'
import TypesOfMonitoringNeededPage from '../types-of-monitoring-needed/TypesOfMonitoringNeededPage'

const mockOrderId = uuidv4()
const apiPath = '/monitoring-conditions'
const stubGetOrder = ({
  notifyingOrg = 'PROBATION',
  curfewConditions = null,
  curfewReleaseDateConditions = null,
  curfewTimeTable = [],
  monitoringConditionsTrail = null,
  monitoringConditionsAlcohol = null,
  monitoringConditions = null,
} = {}) => {
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
      monitoringConditions,
      curfewConditions,
      curfewReleaseDateConditions,
      curfewTimeTable,
      monitoringConditionsTrail,
      monitoringConditionsAlcohol,
    },
  })
}
const createMonitoringConditions = (override: Partial<MonitoringConditions> = {}) => {
  return {
    startDate: null,
    endDate: null,
    orderType: null,
    curfew: null,
    exclusionZone: null,
    trail: null,
    mandatoryAttendance: null,
    alcohol: null,
    conditionType: null,
    orderTypeDescription: null,
    sentenceType: null,
    issp: null,
    hdc: null,
    prarr: null,
    pilot: null,
    offenceType: null,
    policeArea: null,
    ...override,
  }
}

const stubPutMonitoringConditions = () => {
  cy.task('stubCemoSubmitOrder', {
    httpStatus: 200,
    id: mockOrderId,
    subPath: apiPath,
    response: {
      orderType: 'POST_RELEASE',
      orderTypeDescription: null,
      conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
      curfew: null,
      exclusionZone: null,
      trail: null,
      mandatoryAttendance: null,
      alcohol: null,
      startDate: '2024-10-10T11:00:00.000Z',
      endDate: '2024-10-11T11:00:00.000Z',
      sentenceType: 'EPP',
      issp: 'YES',
      hdc: 'NO',
      prarr: 'UNKNOWN',
      pilot: '',
      offenceType: '',
    },
  })
}

context('order type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
    })
    cy.signIn()
    stubPutMonitoringConditions()
  })

  it('Should show errors no answer selected', () => {
    const page = Page.visit(PrarrPage, { orderId: mockOrderId })

    page.form.fillInWith('Yes')
    page.form.continueButton.click()

    Page.verifyOnPage(MonitoringTypePage)
  })

  it('Should redirect to list monitoring page when no monitoring condition is available', () => {
    const testFlags = { ORDER_TYPE_DESCRIPTION_FLOW_ENABLED: true, LIST_MONITORING_CONDITION_FLOW_ENABLED: true }
    cy.task('setFeatureFlags', testFlags)
    stubGetOrder({
      monitoringConditions: createMonitoringConditions({ alcohol: true, hdc: 'NO', pilot: 'UNKNOWN' }),
      monitoringConditionsAlcohol: {
        endDate: null,
        installationLocation: null,
        monitoringType: null,
        prisonName: null,
        probationOfficeName: null,
        startDate: null,
      },
    })

    const page = Page.visit(PrarrPage, { orderId: mockOrderId })

    page.form.fillInWith('Yes')
    page.form.continueButton.click()

    Page.verifyOnPage(TypesOfMonitoringNeededPage)
    cy.task('resetFeatureFlags')
  })
})
