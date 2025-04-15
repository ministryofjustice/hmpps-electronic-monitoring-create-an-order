import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import MonitoringConditionsPage from '../../../pages/order/monitoring-conditions'
import InstallationAddressPage from '../../../pages/order/monitoring-conditions/installation-address'

const mockOrderId = uuidv4()
const apiPath = '/monitoring-conditions'

const validFormData = {
  orderType: 'IMMIGRATION',
  orderTypeDescription: 'GPS Acquisitive Crime HDC',
  monitoringRequired: [
    'Curfew',
    'Exclusion zone monitoring',
    'Trail monitoring',
    'Mandatory attendance monitoring',
    'Alcohol monitoring',
  ],
  conditionType: 'License Condition of a Custodial Order',
  startDate: new Date('2024-02-27T11:02:00Z'),
  endDate: new Date('2025-03-08T04:40:00Z'),
  sentenceType: 'Extended Determinate Sentence',
  issp: 'No',
  hdc: 'Yes',
  prarr: 'Not able to provide this information',
}

const mockResponse = {
  orderType: 'IMMIGRATION',
  orderTypeDescription: 'DAPOL',
  conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
  curfew: true,
  exclusionZone: true,
  trail: true,
  mandatoryAttendance: true,
  alcohol: true,
  startDate: '2024-10-10T11:00:00.000Z',
  endDate: '2024-10-11T11:00:00.000Z',
  sentenceType: 'EPP',
  issp: 'YES',
  hdc: 'NO',
  prarr: 'UNKNOWN',
}

context('Monitoring conditions', () => {
  context('Index', () => {
    context('Submitting a valid response with all monitoring conditions selected', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoSubmitOrder', { httpStatus: 200, id: mockOrderId, subPath: apiPath, response: mockResponse })

        cy.signIn()
      })

      it('Should submit a correctly formatted monitoring conditions', () => {
        const page = Page.visit(MonitoringConditionsPage, {
          orderId: mockOrderId,
        })

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()
        Page.verifyOnPage(InstallationAddressPage)

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}/monitoring-conditions`,
          body: {
            orderType: 'IMMIGRATION',
            orderTypeDescription: 'GPS_ACQUISITIVE_CRIME_HDC',
            conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
            curfew: true,
            exclusionZone: true,
            trail: true,
            mandatoryAttendance: true,
            alcohol: true,
            startDate: '2024-02-27T11:02:00.000Z',
            endDate: '2025-03-08T04:40:00.000Z',
            sentenceType: 'EXTENDED_DETERMINATE_SENTENCE',
            issp: 'NO',
            hdc: 'YES',
            prarr: 'UNKNOWN',
          },
        }).should('be.true')
      })
    })
  })
})
