import { v4 as uuidv4 } from 'uuid'
import config from '../support/config'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, createFakeAddress } from '../mockApis/faker'

import Page from '../pages/page'
import IndexPage from '../pages/index'
import OrderSummaryPage from '../pages/order/summary'
import SubmitSuccessPage from '../pages/order/submit-success'
import { stubAttachments } from './utils'
import SearchPage from '../pages/search'
import createNewOrder from '../utils/scenario-flows/create-new-order.cy'

context('The kitchen sink', () => {
  const takeScreenshots = config.screenshots_enabled
  const fmsCaseId: string = uuidv4()
  const hmppsDocumentId: string = uuidv4()
  const files = {
    licence: {
      contents: 'cypress/fixtures/test.pdf',
      fileName: 'test.pdf',
    },
  }

  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER', 'ROLE_PRISON'],
    })

    cy.task('stubFMSCreateDeviceWearer', {
      httpStatus: 200,
      response: { result: [{ id: fmsCaseId, message: '' }] },
    })

    cy.task('stubFMSCreateMonitoringOrder', {
      httpStatus: 200,
      response: { result: [{ id: uuidv4(), message: '' }] },
    })

    stubAttachments(files, fmsCaseId, hmppsDocumentId)
  })

  context('Fill in everything "including the kitchen sink" and screenshot', () => {
    const deviceWearerDetails = {
      ...createFakeAdultDeviceWearer(),
      disabilities: 'The device wearer does not have any of the disabilities or health conditions listed',
      otherDisability: null,
      interpreterRequired: true,
      language: 'Flemish (Dutch)',
      hasFixedAddress: 'Yes',
    }
    const primaryAddressDetails = {
      ...createFakeAddress(),
      hasAnotherAddress: 'Yes',
    }
    const secondaryAddressDetails = {
      ...createFakeAddress(),
      hasAnotherAddress: 'Yes',
    }
    const tertiaryAddressDetails = createFakeAddress()
    const interestedParties = createFakeInterestedParties('Prison', 'Probation', 'Liverpool Prison', 'North West')
    const probationDeliveryUnit = { unit: 'Blackburn' }
    const monitoringOrderTypeDescription = {
      pilot: 'GPS acquisitive crime (EMAC)',
      sentenceType: 'Standard Determinate Sentence',
      typeOfAcquistiveCrime: 'Aggravated Burglary',
      policeForceArea: 'Kent',
      monitoringCondition: ['Curfew', 'Exclusion zone monitoring', 'Exclusion zone monitoring', 'Trail monitoring'],
      hdc: 'Yes',
      prarr: 'No',
    }
    const curfewReleaseDetails = {
      startTime: { hours: '19', minutes: '00' },
      endTime: { hours: '07', minutes: '00' },
      address: /Main address/,
    }
    const curfewConditionDetails = {
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 15), // 15 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 35), // 35 days
      addresses: [/Main address/, /Second address/, /Third address/],
      curfewAdditionalDetails: 'some additional details',
    }
    const curfewNights = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    const curfewTimetable = curfewNights.flatMap((day: string) => [
      {
        day,
        startTime: '00:00:00',
        endTime: '07:00:00',
        addresses: curfewConditionDetails.addresses,
      },
      {
        day,
        startTime: '19:00:00',
        endTime: '11:59:00',
        addresses: curfewConditionDetails.addresses,
      },
    ])
    const primaryEnforcementZoneDetails = {
      zoneType: 'Exclusion zone',
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 100), // 100 days
      uploadFile: files.licence,
      description: 'A test description: Lorum ipsum dolar sit amet...',
      duration: 'A test duration: one, two, three...',
      name: 'zone name',
    }
    const secondEnforcementZoneDetails = {
      zoneType: 'Exclusion zone',
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 100), // 100 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 200), // 200 days
      uploadFile: files.licence,
      description: 'A second test description: Lorum ipsum dolar sit amet...',
      duration: 'A second test duration: one, two, three...',
      name: 'zone two name',
    }
    const installationAndRisk = {
      offence: 'Sexual offences',
      possibleRisk: 'Sex offender',
      riskCategory: 'Children under the age of 18 are living at the property',
      riskDetails: 'No risk',
    }
    // Disabled as alcohol monitoring can't currently be selected as a monitoring type.
    // const alcoholMonitoringOrder = {
    //   startDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)), // 15 days
    //   endDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 35).setHours(0, 0, 0, 0)), // 35 days
    //   monitoringType: 'Alcohol abstinence',
    //   installLocation: `at installation address: ${installationAddressDetails}`,
    // }
    const trailMonitoringOrder = {
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 15), // 15 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 35), // 35 days
    }

    it('Should successfully submit the order to the FMS API', () => {
      cy.signIn()

      createNewOrder({ notifyingOrganisation: interestedParties })

      const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      orderSummaryPage.fillInNewOrderWith({
        deviceWearerDetails,
        responsibleAdultDetails: undefined,
        primaryAddressDetails,
        secondaryAddressDetails,
        tertiaryAddressDetails,
        interestedParties,
        installationAndRisk,
        monitoringOrderTypeDescription,
        installationAddressDetails: undefined,
        curfewReleaseDetails,
        curfewConditionDetails,
        curfewTimetable,
        enforcementZoneDetails: primaryEnforcementZoneDetails,
        secondEnforcementZoneDetails,
        alcoholMonitoringDetails: undefined,
        trailMonitoringDetails: trailMonitoringOrder,
        attendanceMonitoringDetails: undefined,
        files,
        probationDeliveryUnit,
        installationLocation: undefined,
        installationAppointment: undefined,
        newDeviceWearerFlow: true,
      })
      orderSummaryPage.submitOrderButton.click()

      const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
      if (takeScreenshots) cy.screenshot('33. submitSuccessPage', { overwrite: true })
      submitSuccessPage.backToYourApplications.click()

      const indexPage = Page.verifyOnPage(IndexPage)
      if (takeScreenshots) cy.screenshot('34. indexPageAfterSubmission', { overwrite: true })
      indexPage.searchNav.click()

      const searchPage = Page.verifyOnPage(SearchPage)
      if (takeScreenshots) cy.screenshot('35. searchPageAfterSubmission', { overwrite: true })
      searchPage.searchBox.type(deviceWearerDetails.lastName)
      searchPage.searchButton.click()
      searchPage.ordersList.contains(`${deviceWearerDetails.firstName} ${deviceWearerDetails.lastName}`)
    })
  })
})
