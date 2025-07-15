import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import MonitoringConditionsPage from '../../../pages/order/monitoring-conditions'
import InstallationLocationPage from '../../../pages/order/monitoring-conditions/installation-location'
import CurfewConditionsPage from '../../../pages/order/monitoring-conditions/curfew-conditions'

const mockOrderId = uuidv4()
const apiPath = '/monitoring-conditions'

const validFormData = {
  monitoringRequired: ['Curfew', 'Exclusion zone monitoring', 'Trail monitoring', 'Mandatory attendance monitoring'],
  conditionType: 'Licence condition',
  orderTypeDescription: null,
  startDate: new Date('2024-02-27T11:02:00Z'),
  endDate: new Date('2025-03-08T04:40:00Z'),
  sentenceType: 'Extended Determinate Sentence',
  issp: 'No',
  hdc: 'Yes',
  prarr: 'Not able to provide this information',
  pilot: 'GPS Acquisitive Crime Parole',
}

const mockResponse = {
  orderType: 'POST_RELEASE',
  orderTypeDescription: 'DAPOL',
  conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
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

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: { dataDictionaryVersion: 'DDV5' },
        })
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
            orderType: 'POST_RELEASE',
            orderTypeDescription: null,
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
          monitoringRequired: ['Curfew'],
          conditionType: 'Licence condition',
          startDate: new Date('2024-02-27T11:02:00Z'),
          endDate: new Date('2025-03-08T04:40:00Z'),
          sentenceType: 'Extended Determinate Sentence',
          issp: 'No',
          hdc: 'Yes',
          prarr: 'Not able to provide this information',
          pilot: 'GPS_ACQUISITIVE_CRIME_PAROLE',
        }

        const response = {
          orderType: 'POST_RELEASE',
          orderTypeDescription: null,
          conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
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

      context('should successfully submit with order with data dictionary version DDV4', () => {
        const formData = {
          orderTypeDescription: 'Domestic Abuse Perpetrator on Licence (DAPOL)',
          monitoringRequired: ['Curfew'],
          conditionType: 'Licence condition',
          startDate: new Date('2024-02-27T11:02:00Z'),
          endDate: new Date('2025-03-08T04:40:00Z'),
          sentenceType: 'Extended Determinate Sentence',
          issp: 'No',
          hdc: 'Yes',
          prarr: 'Not able to provide this information',
        }

        const response = {
          orderType: 'IMMIGRATION',
          orderTypeDescription: 'DAPOL',
          conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
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
          pilot: null,
        }

        it('should successfully submit', () => {
          cy.task('stubCemoGetOrder', {
            httpStatus: 200,
            id: mockOrderId,
            status: 'IN_PROGRESS',
            order: { dataDictionaryVersion: 'DDV4' },
          })

          cy.task('stubCemoSubmitOrder', { httpStatus: 200, id: mockOrderId, subPath: apiPath, response })

          const page = Page.visit(MonitoringConditionsPage, {
            orderId: mockOrderId,
          })

          page.form.fillInWith(formData)
          page.form.saveAndContinueButton.click()
          Page.verifyOnPage(CurfewConditionsPage)
        })

        it('should successfully submit when They are not part of any of these pilots is selected', () => {
          cy.task('stubCemoGetOrder', {
            httpStatus: 200,
            id: mockOrderId,
            status: 'IN_PROGRESS',
            order: { dataDictionaryVersion: 'DDV4' },
          })

          cy.task('stubCemoSubmitOrder', { httpStatus: 200, id: mockOrderId, subPath: apiPath, response })

          const page = Page.visit(MonitoringConditionsPage, {
            orderId: mockOrderId,
          })

          formData.orderTypeDescription = 'They are not part of any of these pilots'
          page.form.fillInWith(formData)
          page.form.saveAndContinueButton.click()
          Page.verifyOnPage(CurfewConditionsPage)

          cy.task('stubCemoVerifyRequestReceived', {
            uri: `/orders/${mockOrderId}/monitoring-conditions`,
            body: {
              orderType: 'POST_RELEASE',
              orderTypeDescription: 'UNKNOWN',
              conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
              curfew: true,
              exclusionZone: false,
              trail: false,
              mandatoryAttendance: false,
              alcohol: false,
              startDate: '2024-02-27T11:02:00.000Z',
              endDate: '2025-03-08T04:40:00.000Z',
              sentenceType: 'EXTENDED_DETERMINATE_SENTENCE',
              issp: 'NO',
              hdc: 'YES',
              prarr: 'UNKNOWN',
              pilot: null,
            },
          }).should('be.true')
        })
      })
    })
  })
})
