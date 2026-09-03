import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, createFakeAddress } from '../../../mockApis/faker'
import fillInMonitoringTypeWith from '../../../utils/scenario-flows/monitoringType'
import { verifyCurfewInCheckYourAnswersPage } from '../../../utils/scenario-flows/curfew.cy'
import createNewOrder from '../../../utils/scenario-flows/create-new-order.cy'

context('Curfew on day of release', () => {
  const currentDate = new Date()

  const deviceWearerDetails = {
    ...createFakeAdultDeviceWearer(),
    disabilities: 'The device wearer does not have any of the disabilities or health conditions listed',
    otherDisability: null,
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

  const installationLocationDetails = {
    location: 'At a prison',
  }

  const installationAppointmentDetails = {
    placeName: 'mock prison',
    appointmentDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(13, 0, 0, 0)),
  }

  const installationAddress = createFakeAddress()

  const curfew = {
    startDate: new Date(currentDate.getFullYear() + 1, 0, 1, 0, 0, 0),
    endDate: new Date(currentDate.getFullYear() + 2, 0, 1, 23, 59, 0),
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

  const nonStandardCurfewReleaseDay = {
    startTime: { hours: '20', minutes: '00' },
    endTime: { hours: '07', minutes: '30' },
  }

  const standardCurfewReleaseDay = {
    startTime: { hours: '19', minutes: '00' },
    endTime: { hours: '07', minutes: '00' },
  }

  let orderSummaryPage: OrderSummaryPage
  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER', 'ROLE_PRISON'],
    })

    const interestedParties = createFakeInterestedParties('Prison', 'Home Office', 'Sudbury Prison', null)
    createNewOrder({
      notifyingOrganisation: interestedParties,
    })

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.aboutTheDeviceWearerTask.click()

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
      newDeviceWearerFlow: true,
    })
  })

  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  it('applies the standard curfew times and skips the release day page when I select yes', () => {
    fillInMonitoringTypeWith({
      monitoringType: 'Curfew',
      curfewConditionDetails: curfew,
      curfewDayOfReleaseAnswer: 'Yes',
      curfewTimetable: curfewTimetableDetails,
    })

    fillInMonitoringTypeWith({
      additionalMonitoringConditions: 'No',
      installationLocation: installationLocationDetails,
      installationAppointment: installationAppointmentDetails,
      installationAddressDetails: installationAddress,
    })

    verifyCurfewInCheckYourAnswersPage({
      curfewConditionDetails: curfew,
      curfewReleaseDetails: standardCurfewReleaseDay,
      curfewTimetable: curfewTimetableDetails,
    })
  })

  it('continues to the manual release day page when I select no', () => {
    fillInMonitoringTypeWith({
      monitoringType: 'Curfew',
      curfewConditionDetails: curfew,
      curfewDayOfReleaseAnswer: 'No',
      curfewReleaseDetails: nonStandardCurfewReleaseDay,
      curfewTimetable: curfewTimetableDetails,
    })

    fillInMonitoringTypeWith({
      additionalMonitoringConditions: 'No',
      installationLocation: installationLocationDetails,
      installationAppointment: installationAppointmentDetails,
      installationAddressDetails: installationAddress,
    })

    verifyCurfewInCheckYourAnswersPage({
      curfewConditionDetails: curfew,
      curfewReleaseDetails: nonStandardCurfewReleaseDay,
      curfewTimetable: curfewTimetableDetails,
    })
  })
})
