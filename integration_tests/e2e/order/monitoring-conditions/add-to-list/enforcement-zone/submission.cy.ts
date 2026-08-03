import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import EnforcementZoneAddToListPage from './EnforcementZonePage'
import OrderSummaryPage from '../../../../../pages/order/summary'
import { EnforcementZoneAddToListFormData } from './EnforcementZoneComponent'
import TypesOfMonitoringNeededPage from '../../order-type-description/types-of-monitoring-needed/TypesOfMonitoringNeededPage'

const mockOrderId = uuidv4()
const apiPath = '/enforcementZone'
const uploadApiPath = '/attachment'
const zoneTypes: (`exclusion` | `restriction`)[] = [`exclusion`, `restriction`]

const localMidnight = (daysFromNow: number): Date => {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  d.setHours(0, 0, 0, 0)
  return d
}

const zoneStartDate = localMidnight(30)
const zoneEndDate = localMidnight(60)
const dateAsPayload = (d: Date, hour: number, minuite: number): string =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, minuite).toISOString()
const zoneStartDatePayload = dateAsPayload(zoneStartDate, 0, 0)
const zoneEndDatePayload = dateAsPayload(zoneEndDate, 23, 59)

zoneTypes.forEach(type => {
  context(`Monitoring conditions - ${type} Zone`, () => {
    context('Submitting a valid Exclusion zone order', () => {
      const zoneType = 'Exclusion zone'
      const zoneTypeId = type.toUpperCase()

      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            monitoringConditions: {
              orderType: 'IMMIGRATION',
              orderTypeDescription: null,
              conditionType: null,
              acquisitiveCrime: false,
              dapol: false,
              curfew: false,
              exclusionZone: false,
              trail: false,
              mandatoryAttendance: true,
              alcohol: false,
              startDate: null,
              endDate: null,
              sentenceType: null,
              issp: null,
              hdc: null,
              prarr: null,
              pilot: null,
              offenceType: null,
            },
          },
        })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            orderId: mockOrderId,
            zoneType: zoneTypeId,
            zoneId: 1,
            startDate: zoneStartDatePayload,
            endDate: zoneEndDatePayload,
            name: 'A test name: Lorem ipsum dolor sit amet...',
            description: 'A test description: Lorem ipsum dolor sit amet...',
            duration: 'A test duration: Lorem ipsum dolor sit amet...',
          },
        })

        cy.signIn()
      })

      it(`should submit a correctly formatted ${type} zone submission`, () => {
        const page = Page.visit(EnforcementZoneAddToListPage, { orderId: mockOrderId, zoneId: 1 }, undefined, type)
        const validFormData = {
          zoneType,
          startDate: zoneStartDate,
          endDate: zoneEndDate,
          name: 'A test name: Lorem ipsum dolor sit amet...',
          description: 'A test description: Lorem ipsum dolor sit amet...',
          duration: 'A test duration: Lorem ipsum dolor sit amet...',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            zoneType: zoneTypeId,
            zoneId: 1,

            startDate: zoneStartDatePayload,
            endDate: zoneEndDatePayload,
            name: 'A test name: Lorem ipsum dolor sit amet...',
            description: 'A test description: Lorem ipsum dolor sit amet...',
            duration: 'A test duration: Lorem ipsum dolor sit amet...',
          },
        }).should('be.true')
      })

      it('should submit a correctly without enddate when notifying organisation is HOME_OFFICE', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            interestedParties: {
              notifyingOrganisation: 'HOME_OFFICE',
              notifyingOrganisationName: 'Home Office',
              notifyingOrganisationEmail: 'test@homeoffice.gov.uk',
              responsibleOfficerName: 'Test Officer',
              responsibleOfficerPhoneNumber: '01234567890',
              responsibleOrganisation: 'PROBATION',
              responsibleOrganisationRegion: 'Test Region',
              responsibleOrganisationEmail: 'test@probation.gov.uk',
            },
            monitoringConditions: {
              orderType: 'IMMIGRATION',
              orderTypeDescription: null,
              conditionType: null,
              acquisitiveCrime: false,
              dapol: false,
              curfew: false,
              exclusionZone: false,
              trail: false,
              mandatoryAttendance: true,
              alcohol: false,
              startDate: null,
              endDate: null,
              sentenceType: null,
              issp: null,
              hdc: null,
              prarr: null,
              pilot: null,
              offenceType: null,
            },
          },
        })
        const page = Page.visit(EnforcementZoneAddToListPage, { orderId: mockOrderId, zoneId: 1 }, undefined, type)

        const validFormData = {
          zoneType,
          startDate: zoneStartDate,
          name: 'A test name: Lorem ipsum dolor sit amet...',
          description: 'A test description: Lorem ipsum dolor sit amet...',
          duration: 'A test duration: Lorem ipsum dolor sit amet...',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            zoneType: zoneTypeId,
            zoneId: 1,
            startDate: zoneStartDatePayload,
            name: 'A test name: Lorem ipsum dolor sit amet...',
            description: 'A test description: Lorem ipsum dolor sit amet...',
            duration: 'A test duration: Lorem ipsum dolor sit amet...',
          },
        }).should('be.true')
      })

      it('should continue to the types of monitoring needed page', () => {
        const page = Page.visit(EnforcementZoneAddToListPage, { orderId: mockOrderId, zoneId: 1 }, undefined, type)

        const validFormData = {
          zoneType,
          startDate: zoneStartDate,
          endDate: zoneEndDate,
          name: 'A test name: Lorem ipsum dolor sit amet...',
          description: 'A test description: Lorem ipsum dolor sit amet...',
          duration: 'A test duration: Lorem ipsum dolor sit amet...',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(TypesOfMonitoringNeededPage)
      })

      it('should return to the summary page', () => {
        const page = Page.visit(EnforcementZoneAddToListPage, { orderId: mockOrderId, zoneId: 1 }, undefined, type)

        const validFormData = {
          zoneType,
          startDate: zoneStartDate,
          endDate: zoneEndDate,
          name: 'A test name: Lorem ipsum dolor sit amet...',
          description: 'A test description: Lorem ipsum dolor sit amet...',
          duration: 'A test duration: Lorem ipsum dolor sit amet...',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAsDraftButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })
    context('submitting an enforcement zone order with a file', () => {
      const zoneId = 1
      const zoneType = 'Exclusion zone'
      const zoneTypeId = 'EXCLUSION'
      const fileContents = 'Test image file'

      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            monitoringConditions: {
              orderType: 'IMMIGRATION',
              orderTypeDescription: null,
              conditionType: null,
              acquisitiveCrime: false,
              dapol: false,
              curfew: false,
              exclusionZone: false,
              trail: false,
              mandatoryAttendance: true,
              alcohol: false,
              startDate: null,
              endDate: null,
              sentenceType: null,
              issp: null,
              hdc: null,
              prarr: null,
              pilot: null,
              offenceType: null,
            },
          },
        })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            orderId: mockOrderId,
            zoneType: zoneTypeId,
            zoneId,
            startDate: zoneStartDatePayload,
            endDate: zoneEndDatePayload,
            name: 'A test name: Lorem ipsum dolor sit amet...',
            description: 'A test description: Lorem ipsum dolor sit amet...',
            duration: 'A test duration: Lorem ipsum dolor sit amet...',
          },
        })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          method: 'POST',
          id: mockOrderId,
          subPath: `${apiPath}/${zoneId}${uploadApiPath}`,
          response: {},
        })

        cy.signIn()
      })

      it('should submit a correctly formatted file upload submission', () => {
        const page = Page.visit(EnforcementZoneAddToListPage, { orderId: mockOrderId, zoneId: 1 }, undefined, type)

        const validFormData = {
          zoneType,
          startDate: zoneStartDate,
          endDate: zoneEndDate,
          name: 'A test name: Lorem ipsum dolor sit amet...',
          description: 'A test description: Lorem ipsum dolor sit amet...',
          duration: 'A test duration: Lorem ipsum dolor sit amet...',
          uploadFile: {
            fileName: 'test-image.jpeg',
            rawContent: fileContents,
          },
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}/${zoneId}${uploadApiPath}`,
          fileContents: [
            {
              name: 'file',
              filename: 'test-image.jpeg',
              contentType: 'image/jpeg',
              contents: fileContents,
            },
          ],
        }).should('be.true')
      })

      it('should continue to the types of monitoring needed page', () => {
        const page = Page.visit(EnforcementZoneAddToListPage, { orderId: mockOrderId, zoneId: 1 }, undefined, type)

        const validFormData: EnforcementZoneAddToListFormData = {
          startDate: zoneStartDate,
          endDate: zoneEndDate,
          name: 'A test name: Lorem ipsum dolor sit amet...',
          description: 'A test description: Lorem ipsum dolor sit amet...',
          duration: 'A test duration: Lorem ipsum dolor sit amet...',
          uploadFile: {
            fileName: 'test-image.jpeg',
            rawContent: fileContents,
          },
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(TypesOfMonitoringNeededPage, { orderId: mockOrderId, zoneId: 2 })
      })

      it('should return to the summary page', () => {
        const page = Page.visit(EnforcementZoneAddToListPage, { orderId: mockOrderId, zoneId: 1 }, undefined, type)

        const validFormData = {
          zoneType,
          startDate: zoneStartDate,
          endDate: zoneEndDate,
          name: 'A test name: Lorem ipsum dolor sit amet...',
          description: 'A test description: Lorem ipsum dolor sit amet...',
          duration: 'A test duration: Lorem ipsum dolor sit amet...',
          uploadFile: {
            fileName: 'test-image.jpeg',
            rawContent: fileContents,
          },
        }

        page.form.fillInWith(validFormData)
        page.form.saveAsDraftButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })
  })
})
