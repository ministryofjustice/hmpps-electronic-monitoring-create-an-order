import { v4 as uuidv4 } from 'uuid'
import fillInOrderTypeDescriptionsWith from '../../../../utils/scenario-flows/orderTypeDescription'
import OrderTypePage from './order-type/OrderTypePage'
import Page from '../../../../pages/page'

const mockOrderId = uuidv4()
const currentDate = new Date()
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
      addresses: [
        {
          addressType: 'PRIMARY',
          addressLine1: '10 Downing Street',
          addressLine2: '',
          addressLine3: '',
          addressLine4: '',
          postcode: '',
        },
      ],
    },
  })
}
context('Order type descriptions', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.signIn()

    const testFlags = { DAPOL_PILOT_PROBATION_REGIONS: 'KENT_SURREY_SUSSEX,WALES' }

    cy.task('setFeatureFlags', testFlags)
  })

  it('Notification org is prison, full HDC and pilot flow', () => {
    stubGetOrder('PRISON')
    const monitoringOrderTypeDescription = {
      sentenceType: 'Standard Determinate Sentence',
      hdc: 'Yes',
      pilot: 'GPS acquisitive crime (EMAC)',
      typeOfAcquistiveCrime: 'Aggravated Burglary',
      policeForceArea: 'Kent',
      prarr: 'Yes',
      monitoringStartDate: new Date(currentDate.getFullYear(), 0, 1),
      monitoringEndDate: new Date(currentDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }
    Page.visit(OrderTypePage, { orderId: mockOrderId })
    fillInOrderTypeDescriptionsWith(monitoringOrderTypeDescription)
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/monitoring-conditions`,
      body: {
        orderType: 'POST_RELEASE',
        conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
        sentenceType: 'STANDARD_DETERMINATE_SENTENCE',
        curfew: false,
        exclusionZone: false,
        trail: true,
        mandatoryAttendance: false,
        alcohol: false,
        startDate: monitoringOrderTypeDescription.monitoringStartDate,
        endDate: monitoringOrderTypeDescription.monitoringEndDate,
        hdc: 'YES',
        pilot: 'GPS_ACQUISITIVE_CRIME_HOME_DETENTION_CURFEW',
        offenceType: 'Aggravated Burglary in a Dwelling',
        prarr: 'YES',
        policeArea: 'Kent',
      },
    }).should('be.true')
  })

  it('Notification org is prison, PRARR no', () => {
    stubGetOrder('PRISON')
    const monitoringOrderTypeDescription = {
      sentenceType: 'Extended Determinate Sentence',
      prarr: 'Yes',
      monitoringStartDate: new Date(currentDate.getFullYear(), 0, 1),
      monitoringEndDate: new Date(currentDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    Page.visit(OrderTypePage, { orderId: mockOrderId })
    fillInOrderTypeDescriptionsWith(monitoringOrderTypeDescription)
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/monitoring-conditions`,
      body: {
        orderType: 'POST_RELEASE',
        conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
        sentenceType: 'EXTENDED_DETERMINATE_SENTENCE',
        curfew: false,
        exclusionZone: false,
        trail: true,
        mandatoryAttendance: false,
        alcohol: false,
        startDate: monitoringOrderTypeDescription.monitoringStartDate,
        endDate: monitoringOrderTypeDescription.monitoringEndDate,
        prarr: 'YES',
      },
    }).should('be.true')
  })

  it('Notification org is YCS, sentence Section 250', () => {
    stubGetOrder('YOUTH_CUSTODY_SERVICE')
    const monitoringOrderTypeDescription = {
      sentenceType: 'Section 250 / Section 91',
      prarr: 'Yes',
      monitoringStartDate: new Date(currentDate.getFullYear(), 0, 1),
      monitoringEndDate: new Date(currentDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    Page.visit(OrderTypePage, { orderId: mockOrderId })
    fillInOrderTypeDescriptionsWith(monitoringOrderTypeDescription)
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/monitoring-conditions`,
      body: {
        orderType: 'POST_RELEASE',
        conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
        sentenceType: 'SECTION_91',
        curfew: false,
        exclusionZone: false,
        trail: true,
        mandatoryAttendance: false,
        alcohol: false,
        startDate: monitoringOrderTypeDescription.monitoringStartDate,
        endDate: monitoringOrderTypeDescription.monitoringEndDate,
        hdc: 'YES',
        prarr: 'YES',
      },
    }).should('be.true')
  })

  it('Notification org is YCS, sentence Section DTO, Issp yes', () => {
    stubGetOrder('YOUTH_CUSTODY_SERVICE')
    const monitoringOrderTypeDescription = {
      sentenceType: 'Detention and Training Order',
      issp: 'Yes',
      prarr: 'Yes',
      monitoringStartDate: new Date(currentDate.getFullYear(), 0, 1),
      monitoringEndDate: new Date(currentDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    Page.visit(OrderTypePage, { orderId: mockOrderId })
    fillInOrderTypeDescriptionsWith(monitoringOrderTypeDescription)
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/monitoring-conditions`,
      body: {
        orderType: 'POST_RELEASE',
        conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
        sentenceType: 'DTO',
        curfew: false,
        exclusionZone: false,
        trail: true,
        mandatoryAttendance: false,
        alcohol: false,
        startDate: monitoringOrderTypeDescription.monitoringStartDate,
        endDate: monitoringOrderTypeDescription.monitoringEndDate,
        prarr: 'YES',
        issp: 'YES',
      },
    }).should('be.true')
  })

  it('Notification org is Probation, order type Post Release, sentence Section SDS, Pilot DAPOL, HDC no', () => {
    stubGetOrder()
    const monitoringOrderTypeDescription = {
      orderType: 'Release from prison',
      sentenceType: 'Standard Determinate Sentence',
      hdc: 'No',
      prarr: 'Yes',
      pilot: 'Domestic Abuse Perpetrator on Licence (DAPOL)',
      monitoringStartDate: new Date(currentDate.getFullYear(), 0, 1),
      monitoringEndDate: new Date(currentDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    Page.visit(OrderTypePage, { orderId: mockOrderId })
    fillInOrderTypeDescriptionsWith(monitoringOrderTypeDescription)
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/monitoring-conditions`,
      body: {
        orderType: 'POST_RELEASE',
        conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
        sentenceType: 'STANDARD_DETERMINATE_SENTENCE',
        curfew: false,
        exclusionZone: false,
        trail: true,
        mandatoryAttendance: false,
        alcohol: false,
        startDate: monitoringOrderTypeDescription.monitoringStartDate,
        endDate: monitoringOrderTypeDescription.monitoringEndDate,
        prarr: 'YES',
        hdc: 'NO',
        pilot: 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_DAPOL',
      },
    }).should('be.true')
  })

  it('Notification org is Probation, ordertype community, sentence Section SDS, Pilot DAPOL, HDC no', () => {
    stubGetOrder()
    const monitoringOrderTypeDescription = {
      orderType: 'Community',
      sentenceType: 'Youth Rehabilitation Order (YRO)',
      issp: 'Yes',
      monitoringStartDate: new Date(currentDate.getFullYear(), 0, 1),
      monitoringEndDate: new Date(currentDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    Page.visit(OrderTypePage, { orderId: mockOrderId })
    fillInOrderTypeDescriptionsWith(monitoringOrderTypeDescription)
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/monitoring-conditions`,
      body: {
        orderType: 'COMMUNITY',
        conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
        sentenceType: 'COMMUNITY_YRO',
        curfew: false,
        exclusionZone: false,
        trail: true,
        mandatoryAttendance: false,
        alcohol: false,
        startDate: monitoringOrderTypeDescription.monitoringStartDate,
        endDate: monitoringOrderTypeDescription.monitoringEndDate,
        issp: 'YES',
      },
    }).should('be.true')
  })

  it('Notification org is Probation, ordertype community, sentence Section SDS, Pilot DAPOL, HDC no', () => {
    stubGetOrder()
    const monitoringOrderTypeDescription = {
      orderType: 'Community',
      sentenceType: 'Suspended Sentence',
      monitoringStartDate: new Date(currentDate.getFullYear(), 0, 1),
      monitoringEndDate: new Date(currentDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    Page.visit(OrderTypePage, { orderId: mockOrderId })
    fillInOrderTypeDescriptionsWith(monitoringOrderTypeDescription)
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/monitoring-conditions`,
      body: {
        orderType: 'COMMUNITY',
        conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
        sentenceType: 'COMMUNITY_SUSPENDED_SENTENCE',
        curfew: false,
        exclusionZone: false,
        trail: true,
        mandatoryAttendance: false,
        alcohol: false,
        startDate: monitoringOrderTypeDescription.monitoringStartDate,
        endDate: monitoringOrderTypeDescription.monitoringEndDate,
      },
    }).should('be.true')
  })

  it('Notification org is home office', () => {
    stubGetOrder('HOME_OFFICE')
    const monitoringOrderTypeDescription = {
      monitoringStartDate: new Date(currentDate.getFullYear(), 0, 1),
      monitoringEndDate: new Date(currentDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    Page.visit(OrderTypePage, { orderId: mockOrderId })
    fillInOrderTypeDescriptionsWith(monitoringOrderTypeDescription)
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/monitoring-conditions`,
      body: {
        orderType: 'IMMIGRATION',
        conditionType: 'BAIL_ORDER',
        curfew: false,
        exclusionZone: false,
        trail: true,
        mandatoryAttendance: false,
        alcohol: false,
        startDate: monitoringOrderTypeDescription.monitoringStartDate,
        endDate: monitoringOrderTypeDescription.monitoringEndDate,
      },
    }).should('be.true')
  })

  it('Notification org is Civil', () => {
    stubGetOrder('CIVIL_COUNTY_COURT')
    const monitoringOrderTypeDescription = {
      orderType: 'Civil',
      monitoringStartDate: new Date(currentDate.getFullYear(), 0, 1),
      monitoringEndDate: new Date(currentDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    Page.visit(OrderTypePage, { orderId: mockOrderId })
    fillInOrderTypeDescriptionsWith(monitoringOrderTypeDescription)
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/monitoring-conditions`,
      body: {
        orderType: 'CIVIL',
        conditionType: 'BAIL_ORDER',
        curfew: false,
        exclusionZone: false,
        trail: true,
        mandatoryAttendance: false,
        alcohol: false,
        startDate: monitoringOrderTypeDescription.monitoringStartDate,
        endDate: monitoringOrderTypeDescription.monitoringEndDate,
      },
    }).should('be.true')
  })
})
