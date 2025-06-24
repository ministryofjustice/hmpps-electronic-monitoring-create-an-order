import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import MonitoringConditionsPage from '../../../pages/order/monitoring-conditions'
import InstallationLocationPage from '../../../pages/order/monitoring-conditions/installation-location'
import CurfewConditionsPage from '../../../pages/order/monitoring-conditions/curfew-conditions'

const mockOrderId = uuidv4()
const apiPath = '/monitoring-conditions'

const validFormData = {
  orderType: 'IMMIGRATION',
  monitoringRequired: ['Curfew', 'Exclusion zone monitoring', 'Trail monitoring', 'Mandatory attendance monitoring'],
  conditionType: 'License Condition of a Custodial Order',
  startDate: new Date('2024-02-27T11:02:00Z'),
  endDate: new Date('2025-03-08T04:40:00Z'),
  sentenceType: 'Extended Determinate Sentence',
  issp: 'No',
  hdc: 'Yes',
  prarr: 'Not able to provide this information',
  pilot: 'GPS Acquisitive Crime Parole',
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
  pilot: 'GPS_ACQUISITIVE_CRIME_PAROLE',
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

      it('Should submit a correctly formatted monitoring conditions and got to installation location page', () => {
        const page = Page.visit(MonitoringConditionsPage, {
          orderId: mockOrderId,
        })

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()
        Page.verifyOnPage(InstallationLocationPage)

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}/monitoring-conditions`,
          body: {
            orderType: 'IMMIGRATION',
            orderTypeDescription: 'undefined',
            conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
            curfew: true,
            exclusionZone: true,
            trail: true,
            mandatoryAttendance: true,
            alcohol: false,
            startDate: '2024-02-27T11:02:00.000Z',
            endDate: '2025-03-08T04:40:00.000Z',
            sentenceType: 'EXTENDED_DETERMINATE_SENTENCE',
            issp: 'NO',
            hdc: 'YES',
            prarr: 'UNKNOWN',
            pilot: 'GPS_ACQUISITIVE_CRIME_PAROLE',
          },
        }).should('be.true')
      })

      it('Should go to curfew page when curfew is only condition selected', () => {
        const formData = {
          orderType: 'IMMIGRATION',
          monitoringRequired: ['Curfew'],
          conditionType: 'License Condition of a Custodial Order',
          startDate: new Date('2024-02-27T11:02:00Z'),
          endDate: new Date('2025-03-08T04:40:00Z'),
          sentenceType: 'Extended Determinate Sentence',
          issp: 'No',
          hdc: 'Yes',
          prarr: 'Not able to provide this information',
          pilot: '',
        }

        const response = {
          orderType: 'IMMIGRATION',
          conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
          curfew: true,
          exclusionZone: false,
          trail: false,
          mandatoryAttendance: false,
          alcohol: false,
          startDate: '2024-10-10T11:00:00.000Z',
          endDate: '2024-10-11T11:00:00.000Z',
          sentenceType: 'EPP',
          issp: 'YES',
          hdc: 'NO',
          prarr: 'UNKNOWN',
          pilot: '',
        }

        cy.task('stubCemoSubmitOrder', { httpStatus: 200, id: mockOrderId, subPath: apiPath, response })
        const page = Page.visit(MonitoringConditionsPage, {
          orderId: mockOrderId,
        })

        page.form.fillInWith(formData)
        page.form.saveAndContinueButton.click()
        Page.verifyOnPage(CurfewConditionsPage)
      })
    })
  })
})
