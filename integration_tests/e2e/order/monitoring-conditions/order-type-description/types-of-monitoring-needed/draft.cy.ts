import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import TypesOfMonitoringNeededPage from './TypesOfMonitoringNeededPage'
import { MonitoringConditions } from '../../../../../../server/routes/monitoring-conditions/model'

const mockOrderId = uuidv4()

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
    isValid: false,
    offenceType: null,
    policeArea: null,
    ...override,
  }
}

const stubGetOrder = ({
  monitoringConditions = createMonitoringConditions(),
  curfewConditions = null,
  monitoringConditionsTrail = null,
  enforcementZoneConditions = [],
  mandatoryAttendanceConditions = [],
  monitoringConditionsAlcohol = null,
} = {}) => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    status: 'IN_PROGRESS',
    order: {
      dataDictionaryVersion: 'DDV5',
      monitoringConditions,
      curfewConditions,
      monitoringConditionsTrail,
      enforcementZoneConditions,
      mandatoryAttendanceConditions,
      monitoringConditionsAlcohol,
    },
  })
}

context('Types of monitoring needed', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    stubGetOrder()
    cy.signIn()
  })

  it('Should display Curfew in summary list when added', () => {
    stubGetOrder({
      monitoringConditions: createMonitoringConditions({
        curfew: true,
      }),
      curfewConditions: {
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-02-01T00:00:00Z',
        curfewAddress: null,
        curfewAdditionalDetails: null,
      },
    })

    const page = Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })

    page.form.summaryList.shouldExist()
    page.form.summaryList.shouldHaveItem('Curfew', 'From 01/01/2025 to 01/02/2025')
  })

  it('Should display Trail monitoring in summary list when added', () => {
    stubGetOrder({
      monitoringConditions: createMonitoringConditions({
        trail: true,
      }),
      monitoringConditionsTrail: {
        startDate: '2025-03-10T00:00:00Z',
        endDate: '2025-04-10T00:00:00Z',
      },
      curfewConditions: null,
    })

    const page = Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })

    page.form.summaryList.shouldExist()
    page.form.summaryList.shouldHaveItem('Trail monitoring', 'From 10/03/2025 to 10/04/2025')
    page.form.summaryList.shouldNotHaveItem('Curfew')
  })

  it('Should display Exclusion zone monitoring in summary list when added', () => {
    stubGetOrder({
      monitoringConditions: createMonitoringConditions({
        exclusionZone: true,
      }),
      enforcementZoneConditions: [
        {
          id: '0',
          zoneType: 'EXCLUSION',
          startDate: '2025-07-15T00:00:00Z',
          endDate: '2025-08-15T00:00:00Z',
          description: null,
          duration: null,
          fileName: null,
          fileId: null,
          zoneId: 0,
        },
      ],
    })

    const page = Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })

    page.form.summaryList.shouldExist()
    page.form.summaryList.shouldHaveItem('Exclusion zone monitoring', 'From 15/07/2025 to 15/08/2025')
    page.form.summaryList.shouldNotHaveItem('Curfew')
  })

  it('Should display Mandatory attendance monitoring in summary list when added', () => {
    stubGetOrder({
      monitoringConditions: createMonitoringConditions({
        mandatoryAttendance: true,
      }),
      mandatoryAttendanceConditions: [
        {
          id: '0',
          startDate: '2025-09-01T00:00:00Z',
          endDate: '2025-10-01T00:00:00Z',
          purpose: 'mockPurpose',
          appointmentDay: null,
          startTime: null,
          endTime: null,
          addressLine1: null,
          addressLine2: null,
          addressLine3: null,
          addressLine4: null,
          postcode: null,
        },
      ],
    })

    const page = Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })

    page.form.summaryList.shouldExist()
    page.form.summaryList.shouldHaveItem('Mandatory attendance monitoring', 'mockPurposeFrom 01/09/2025 to 01/10/2025')
    page.form.summaryList.shouldNotHaveItem('Curfew')
  })

  it('Should display Alcohol monitoring in summary list when added', () => {
    stubGetOrder({
      monitoringConditions: createMonitoringConditions({
        alcohol: true,
      }),
      monitoringConditionsAlcohol: {
        startDate: '2025-11-05T00:00:00Z',
        endDate: '2025-12-05T00:00:00Z',
        monitoringType: null,
      },
    })

    const page = Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })

    page.form.summaryList.shouldExist()
    page.form.summaryList.shouldHaveItem('Alcohol monitoring', 'From 05/11/2025 to 05/12/2025')
    page.form.summaryList.shouldNotHaveItem('Curfew')
  })

  it('Should display multiple monitoring types (Curfew and Mandatory Attendance)', () => {
    stubGetOrder({
      monitoringConditions: createMonitoringConditions({
        curfew: true,
        mandatoryAttendance: true,
      }),
      curfewConditions: {
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-02-01T00:00:00Z',
        curfewAddress: null,
        curfewAdditionalDetails: null,
      },
      mandatoryAttendanceConditions: [
        {
          id: 'ma-1',
          startDate: '2025-09-01T00:00:00Z',
          endDate: '2025-10-01T00:00:00Z',
          purpose: 'mockPurpose',
          appointmentDay: null,
          startTime: null,
          endTime: null,
          addressLine1: null,
          addressLine2: null,
          addressLine3: null,
          addressLine4: null,
          postcode: null,
        },
      ],
    })

    const page = Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })

    page.form.summaryList.shouldExist()
    page.form.summaryList.shouldHaveItem('Curfew', 'From 01/01/2025 to 01/02/2025')
    page.form.summaryList.shouldHaveItem('Mandatory attendance monitoring', 'mockPurposeFrom 01/09/2025 to 01/10/2025')
    page.form.summaryList.shouldNotHaveItem('Trail monitoring')
  })

  it('Should display multiple conditions including two Mandatory Attendances', () => {
    stubGetOrder({
      monitoringConditions: createMonitoringConditions({
        curfew: true,
        mandatoryAttendance: true,
      }),
      curfewConditions: {
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-02-01T00:00:00Z',
        curfewAddress: null,
        curfewAdditionalDetails: null,
      },
      mandatoryAttendanceConditions: [
        {
          id: '0',
          startDate: '2025-09-01T00:00:00Z',
          endDate: '2025-10-01T00:00:00Z',
          purpose: 'mockPurpose1',
          appointmentDay: null,
          startTime: null,
          endTime: null,
          addressLine1: null,
          addressLine2: null,
          addressLine3: null,
          addressLine4: null,
          postcode: null,
        },
        {
          id: '1',
          startDate: '2025-11-15T00:00:00Z',
          endDate: '2025-12-15T00:00:00Z',
          purpose: 'mockPurpose2',
          appointmentDay: null,
          startTime: null,
          endTime: null,
          addressLine1: null,
          addressLine2: null,
          addressLine3: null,
          addressLine4: null,
          postcode: null,
        },
      ],
    })

    const page = Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })

    page.form.summaryList.shouldExist()
    page.form.summaryList.shouldHaveItem('Curfew', 'From 01/01/2025 to 01/02/2025')
    page.form.summaryList.shouldHaveItemAtIndex(
      'Mandatory attendance monitoring',
      'mockPurpose1From 01/09/2025 to 01/10/2025',
      0,
    )
    page.form.summaryList.shouldHaveItemAtIndex(
      'Mandatory attendance monitoring',
      'mockPurpose2From 15/11/2025 to 15/12/2025',
      1,
    )
  })
})
