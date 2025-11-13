import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import {
  createFakeAdultDeviceWearer,
  createFakeInterestedParties,
  createFakeAddress,
  createKnownAddress,
} from '../../../mockApis/faker'
import fillInMonitoringTypeWith from '../../../utils/scenario-flows/monitoringType'
import { verifyTagAtSourceInCheckYourAnswersPage } from '../../../utils/scenario-flows/installation-location.cy'
import { verifyTrailMonitoringInCheckYourAnswersPage } from '../../../utils/scenario-flows/trail-monitoring.cy'
import { verifyAlcoholMonitoringInCheckYourAnswersPage } from '../../../utils/scenario-flows/alcohol-monitoring.cy'
import { verifyAttendanceMonitoringInCheckYourAnswersPage } from '../../../utils/scenario-flows/attendence-monitoring.cy'
import { verifyEnforcementZoneInCheckYourAnswersPage } from '../../../utils/scenario-flows/enforcement-zone.cy'
import { verifyCurfewInCheckYourAnswersPage } from '../../../utils/scenario-flows/curfew.cy'

context('Monitoring type list flow', () => {
  const currentDate = new Date()
  const deviceWearerDetails = {
    ...createFakeAdultDeviceWearer(),
    interpreterRequired: false,
    language: '',
    hasFixedAddress: 'Yes',
  }

  const primaryAddressDetails = {
    ...createFakeAddress(),
    hasAnotherAddress: 'No',
  }

  const installationAndRisk = {
    offence: 'Sexual offences',
    possibleRisk: 'Sex offender',
    riskCategory: 'Children under the age of 18 are living at the property',
    riskDetails: 'No risk',
  }
  const testFlags = {
    ORDER_TYPE_DESCRIPTION_FLOW_ENABLED: true,
    LIST_MONITORING_CONDITION_FLOW_ENABLED: true,
  }

  let orderSummaryPage: OrderSummaryPage

  const trail = {
    startDate: new Date(currentDate.getFullYear(), 11, 1),
    endDate: new Date(currentDate.getFullYear() + 1, 11, 1, 23, 59, 0),
  }

  const alcohol = {
    startDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)), // 15 days
    endDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 35).setHours(0, 0, 0, 0)), // 35 days
    monitoringType: 'Alcohol abstinence',
  }

  const installationLocationDetails = {
    location: `At a prison`,
  }

  const installationAppointmentDetails = {
    placeName: 'mock prison',
    appointmentDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(13, 0, 0, 0)),
  }
  const installationAddress = createFakeAddress()
  const curfewReleaseDay = {
    releaseDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day
    startTime: { hours: '19', minutes: '00' },
    endTime: { hours: '07', minutes: '00' },
    address: /Main address/,
  }
  const curfew = {
    startDate: new Date(currentDate.getFullYear(), 0, 1, 0, 0, 0),
    endDate: new Date(currentDate.getFullYear() + 1, 0, 1, 23, 59, 0),
    addresses: [/Main address/],
    curfewAdditionalDetails: 'Mock details',
  }
  const curfewNights = ['MONDAY']
  const curfewTimetableDetails = curfewNights.flatMap((day: string) => [
    {
      day,
      startTime: '00:00:00',
      endTime: '07:00:00',
      addresses: curfew.addresses,
    },
    {
      day,
      startTime: '19:00:00',
      endTime: '11:59:00',
      addresses: curfew.addresses,
    },
  ])
  const enforcementZone = {
    zoneType: 'Exclusion zone',
    startDate: new Date(currentDate.getFullYear(), 4, 1),
    endDate: new Date(currentDate.getFullYear() + 1, 4, 1, 23, 59, 0),
    description: 'A test description: Lorum ipsum dolar sit amet...',
    duration: 'A test duration: one, two, three...',
    name: 'Test Zone',
  }

  const attendanceMonitoring = {
    startDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)), // 15 days,
    endDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 35).setHours(0, 0, 0, 0)), // 35 days,
    purpose: 'Attend Bolton Magistrates Court at 9am on Wednesdays & Fridays',
    appointmentDay: 'Wednesdays & Fridays',
    startTime: {
      hours: '09',
      minutes: '00',
    },
    endTime: {
      hours: '12',
      minutes: '00',
    },
    address: createKnownAddress(),
  }
  beforeEach(() => {
    cy.task('setFeatureFlags', testFlags)
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER'],
    })
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.newOrderFormButton.click()

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.aboutTheDeviceWearerTask.click()

    const interestedParties = createFakeInterestedParties('Prison', 'Home Office', 'Altcourse Prison', null)
    const monitoringOrderTypeDescription = {
      sentenceType: 'Standard Determinate Sentence',
      hdc: 'Yes',
      pilot: 'GPS acquisitive crime (EMAC)',
      typeOfAcquistiveCrime: 'Aggravated Burglary',
      policeForceArea: 'Kent',
      prarr: 'Yes',
      monitoringStartDate: new Date(currentDate.getFullYear() + 1, 0, 1),
      monitoringEndDate: new Date(currentDate.getFullYear() + 2, 0, 1),
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      monitoringOrderTypeDescription,
    })
  })

  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  const verifyResult = ({
    installationAddressDetails = undefined,
    installationLocation = undefined,
    installationAppointment = undefined,
    curfewReleaseDetails = undefined,
    curfewConditionDetails = undefined,
    curfewTimetable = undefined,
    enforcementZoneDetails = undefined,
    alcoholMonitoringDetails = undefined,
    trailMonitoringDetails = undefined,
    attendanceMonitoringDetails = undefined,
  }) => {
    verifyTagAtSourceInCheckYourAnswersPage(installationLocation, installationAppointment, installationAddressDetails)

    verifyCurfewInCheckYourAnswersPage({
      curfewConditionDetails,
      curfewReleaseDetails,
      curfewTimetable,
      mainAddress: primaryAddressDetails,
    })

    verifyTrailMonitoringInCheckYourAnswersPage(trailMonitoringDetails)

    verifyAlcoholMonitoringInCheckYourAnswersPage(alcoholMonitoringDetails)

    verifyAttendanceMonitoringInCheckYourAnswersPage(attendanceMonitoringDetails)

    verifyEnforcementZoneInCheckYourAnswersPage(enforcementZoneDetails)
  }
  it('Trail and AM', () => {
    fillInMonitoringTypeWith({
      trailMonitoringDetails: trail,
      monitoringType: 'Trail monitoring',
    })

    fillInMonitoringTypeWith({
      additionalMonitoringConditions: 'Yes',
      monitoringType: 'Alcohol monitoring',
      alcoholMonitoringDetails: alcohol,
    })

    fillInMonitoringTypeWith({
      additionalMonitoringConditions: 'No',
      installationLocation: installationLocationDetails,
      installationAppointment: installationAppointmentDetails,
      installationAddressDetails: installationAddress,
    })

    verifyResult({
      trailMonitoringDetails: trail,
      alcoholMonitoringDetails: alcohol,
      installationLocation: installationLocationDetails,
      installationAppointment: installationAppointmentDetails,
      installationAddressDetails: installationAddress,
    })
  })

  it('All monitoring conditions', () => {
    fillInMonitoringTypeWith({
      trailMonitoringDetails: trail,
      monitoringType: 'Trail monitoring',
    })

    fillInMonitoringTypeWith({
      additionalMonitoringConditions: 'Yes',
      monitoringType: 'Alcohol monitoring',
      alcoholMonitoringDetails: alcohol,
    })

    fillInMonitoringTypeWith({
      additionalMonitoringConditions: 'Yes',
      monitoringType: 'Curfew',
      curfewConditionDetails: curfew,
      curfewReleaseDetails: curfewReleaseDay,
      curfewTimetable: curfewTimetableDetails,
    })

    fillInMonitoringTypeWith({
      additionalMonitoringConditions: 'Yes',
      monitoringType: 'Exclusion zone monitoring',
      enforcementZoneListItemDetails: enforcementZone,
    })

    fillInMonitoringTypeWith({
      additionalMonitoringConditions: 'Yes',
      monitoringType: 'Mandatory attendance monitoring',
      attendanceMonitoringDetails: attendanceMonitoring,
    })

    fillInMonitoringTypeWith({
      additionalMonitoringConditions: 'No',
      installationLocation: installationLocationDetails,
      installationAppointment: installationAppointmentDetails,
      installationAddressDetails: installationAddress,
    })

    verifyResult({
      trailMonitoringDetails: trail,
      alcoholMonitoringDetails: alcohol,
      installationLocation: installationLocationDetails,
      installationAppointment: installationAppointmentDetails,
      installationAddressDetails: installationAddress,
      curfewConditionDetails: curfew,
      curfewReleaseDetails: curfewReleaseDay,
      curfewTimetable: curfewTimetableDetails,
      enforcementZoneDetails: enforcementZone,
      attendanceMonitoringDetails: attendanceMonitoring,
    })
  })

  it('Multiple exclusion zone', () => {
    const enforcementZone2 = {
      zoneType: 'Exclusion zone',
      startDate: new Date(currentDate.getFullYear(), 4, 1),
      endDate: new Date(currentDate.getFullYear() + 1, 4, 1, 23, 59, 0),
      description: '2 A test description: Lorum ipsum dolar sit amet...',
      duration: '2 A test duration: one, two, three...',
      name: 'Test Zone 2',
    }

    const enforcementZone3 = {
      zoneType: 'Exclusion zone',
      startDate: new Date(currentDate.getFullYear(), 4, 1),
      endDate: new Date(currentDate.getFullYear() + 1, 4, 1, 23, 59, 0),
      description: '3 A test description: Lorum ipsum dolar sit amet...',
      duration: '3 A test duration: one, two, three...',
      name: 'Test Zone 3',
    }
    fillInMonitoringTypeWith({
      monitoringType: 'Exclusion zone monitoring',
      enforcementZoneListItemDetails: enforcementZone,
    })

    fillInMonitoringTypeWith({
      additionalMonitoringConditions: 'Yes',
      monitoringType: 'Exclusion zone monitoring',
      enforcementZoneListItemDetails: enforcementZone2,
    })

    fillInMonitoringTypeWith({
      additionalMonitoringConditions: 'Yes',
      monitoringType: 'Exclusion zone monitoring',
      enforcementZoneListItemDetails: enforcementZone3,
    })

    fillInMonitoringTypeWith({
      additionalMonitoringConditions: 'No',
    })

    verifyResult({
      enforcementZoneDetails: enforcementZone,
    })

    verifyResult({
      enforcementZoneDetails: { searchTerm: "[zoneId='1']", ...enforcementZone2 },
    })

    verifyResult({
      enforcementZoneDetails: { searchTerm: "[zoneId='2']", ...enforcementZone3 },
    })
  })

  it('Multiple attendence', () => {
    const attendanceMonitoring2 = {
      startDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)), // 15 days,
      endDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 35).setHours(0, 0, 0, 0)), // 35 days,
      purpose: 'Attendance 2',
      appointmentDay: 'Wednesdays & Fridays',
      startTime: {
        hours: '09',
        minutes: '00',
      },
      endTime: {
        hours: '12',
        minutes: '00',
      },
      address: createKnownAddress(),
    }
    fillInMonitoringTypeWith({
      monitoringType: 'Mandatory attendance monitoring',
      attendanceMonitoringDetails: attendanceMonitoring,
    })

    fillInMonitoringTypeWith({
      additionalMonitoringConditions: 'Yes',
      monitoringType: 'Mandatory attendance monitoring',
      attendanceMonitoringDetails: attendanceMonitoring2,
    })

    fillInMonitoringTypeWith({
      additionalMonitoringConditions: 'No',
    })

    verifyResult({
      attendanceMonitoringDetails: attendanceMonitoring,
    })

    verifyResult({
      attendanceMonitoringDetails: { searchTerm: "[attendance='2']", ...attendanceMonitoring2 },
    })
  })
})
