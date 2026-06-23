import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import IsspPage from './isspPage'
import MonitoringTypePage from '../monitoring-type/MonitoringTypesPage'

const mockOrderId = uuidv4()
const apiPath = '/monitoring-conditions'

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
  })

  it('Should submit form', () => {
    stubPutMonitoringConditions()
    const page = Page.visit(IsspPage, { orderId: mockOrderId })

    page.form.fillInWith('Yes')
    page.form.continueButton.click()

    Page.verifyOnPage(MonitoringTypePage)
  })
})
