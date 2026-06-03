import { v4 as uuidv4 } from 'uuid'
import config from '../support/config'
import {
  createFakeAdultDeviceWearer,
  createFakeYouthDeviceWearer,
  createFakeResponsibleAdult,
  createFakeAddress,
  createFakeInterestedParties,
} from '../mockApis/faker'

import Page from '../pages/page'
import IndexPage from '../pages/index'
import OrderSummaryPage from '../pages/order/summary'
import SubmitSuccessPage from '../pages/order/submit-success'
import { stubAttachments } from './utils'
import SearchPage from '../pages/search'
import createNewOrder from '../utils/scenario-flows/create-new-order.cy'

context('Mandatory fields only', () => {
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

  context('Fill in adult mandatory only fields and screenshot', () => {
    const fullDeviceWearerDetails = createFakeAdultDeviceWearer()
    const deviceWearerDetails = {
      firstName: fullDeviceWearerDetails.firstName,
      lastName: fullDeviceWearerDetails.lastName,
      fullName: `${fullDeviceWearerDetails.firstName} ${fullDeviceWearerDetails.lastName}`,
      dob: fullDeviceWearerDetails.dob,
      is18: true,
      sex: fullDeviceWearerDetails.sex,
      genderIdentity: fullDeviceWearerDetails.genderIdentity,
      disabilities: 'The device wearer does not have any of the disabilities or health conditions listed',
      otherDisability: null,
      interpreterRequired: false,
      contactNumber: undefined,
      hasFixedAddress: 'Yes',
      nomisId: fullDeviceWearerDetails.nomisId,
      deliusId: fullDeviceWearerDetails.deliusId,
      pncId: fullDeviceWearerDetails.pncId,
      prisonNumber: fullDeviceWearerDetails.prisonNumber,
      homeOfficeReferenceNumber: '',
      complianceAndEnforcementPersonReference: fullDeviceWearerDetails.complianceAndEnforcementPersonReference,
      courtCaseReferenceNumber: fullDeviceWearerDetails.courtCaseReferenceNumber,
    }

    const fakeAddress = createFakeAddress()
    const primaryAddressDetails = {
      ...fakeAddress,
      addressLine2: undefined,
      addressLine4: undefined,
      hasAnotherAddress: 'No',
    }

    const interestedParties = createFakeInterestedParties('Prison', 'Probation', 'Liverpool Prison', 'North West')
    const probationDeliveryUnit = { unit: 'Blackburn' }
    const monitoringOrderTypeDescription = {
      pilot: 'GPS acquisitive crime (EMAC)',
      sentenceType: 'Standard Determinate Sentence',
      typeOfAcquistiveCrime: 'Aggravated Burglary',
      policeForceArea: 'Kent',
      monitoringCondition: ['Curfew', 'Exclusion zone monitoring', 'Trail monitoring'],
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
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 20), // 20 days
      curfewAdditionalDetails: '',
    }
    const curfewNights = ['FRIDAY', 'SATURDAY', 'SUNDAY']
    const curfewTimetable = curfewNights.flatMap((day: string) => [
      {
        day,
        startTime: '19:00:00',
        endTime: '07:00:00',
        addresses: [curfewReleaseDetails.address],
      },
    ])
    const primaryEnforcementZoneDetails = {
      zoneType: 'Exclusion zone',
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
      endDate: new Date(new Date().getTime() + 3000 * 60 * 60 * 24 * 10), // 30 days
      description: 'A test description: Lorum ipsum dolar sit amet...',
      duration: 'A test duration: one, two, three...',
      anotherZone: 'No',
      name: 'test name',
    }
    // Disabled as alcohol monitoring can't currently be selected as a monitoring type.
    // const alcoholMonitoringOrder = {
    //   startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 15), // 15 days
    //   monitoringType: 'Alcohol abstinence',
    //   installLocation: `at installation address: ${installationAddressDetails}`,
    // }
    const trailMonitoringOrder = {
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 15), // 15 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 20), // 20 days
    }

    const installationAndRisk = {
      offence: 'Sexual offences',
      possibleRisk: 'Sex offender',
      riskCategory: 'Children under the age of 18 are living at the property',
      riskDetails: 'No risk',
    }
    it('Should successfully submit the order to the FMS API', () => {
      createNewOrder({ notifyingOrganisation: interestedParties })

      const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      orderSummaryPage.fillInNewOrderWith({
        deviceWearerDetails,
        responsibleAdultDetails: undefined,
        primaryAddressDetails,
        secondaryAddressDetails: undefined,
        interestedParties,
        installationAndRisk,
        monitoringOrderTypeDescription,
        installationAddressDetails: undefined,
        curfewReleaseDetails,
        curfewConditionDetails,
        curfewTimetable,
        enforcementZoneDetails: primaryEnforcementZoneDetails,
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
      if (takeScreenshots) cy.screenshot('31. submitSuccessPage', { overwrite: true })
      submitSuccessPage.backToYourApplications.click()

      const indexPage = Page.verifyOnPage(IndexPage)
      if (takeScreenshots) cy.screenshot('32. indexPageAfterSubmission', { overwrite: true })
      indexPage.searchNav.click()

      const searchPage = Page.verifyOnPage(SearchPage)
      if (takeScreenshots) cy.screenshot('33. searchPageAfterSubmission', { overwrite: true })
      searchPage.searchBox.type(deviceWearerDetails.lastName)
      searchPage.searchButton.click()
      searchPage.ordersList.contains(deviceWearerDetails.fullName)
    })
  })

  context('Fill in youth mandatory only fields and screenshot', () => {
    const fullDeviceWearerDetails = createFakeYouthDeviceWearer()
    const deviceWearerDetails = {
      firstName: fullDeviceWearerDetails.firstName,
      lastName: fullDeviceWearerDetails.lastName,
      fullName: `${fullDeviceWearerDetails.firstName} ${fullDeviceWearerDetails.lastName}`,
      dob: fullDeviceWearerDetails.dob,
      is18: false,
      sex: fullDeviceWearerDetails.sex,
      genderIdentity: fullDeviceWearerDetails.genderIdentity,
      disabilities: 'The device wearer does not have any of the disabilities or health conditions listed',
      otherDisability: null,
      interpreterRequired: false,
      contactNumber: undefined,
      hasFixedAddress: 'Yes',
      nomisId: fullDeviceWearerDetails.nomisId,
      deliusId: fullDeviceWearerDetails.deliusId,
      pncId: fullDeviceWearerDetails.pncId,
      prisonNumber: fullDeviceWearerDetails.prisonNumber,
      homeOfficeReferenceNumber: '',
      complianceAndEnforcementPersonReference: fullDeviceWearerDetails.complianceAndEnforcementPersonReference,
      courtCaseReferenceNumber: fullDeviceWearerDetails.courtCaseReferenceNumber,
    }
    const fakeAdult = createFakeResponsibleAdult()
    const responsibleAdultDetails = {
      relationship: fakeAdult.relationship,
      fullName: fakeAdult.fullName,
      contactNumber: fakeAdult.contactNumber,
    }
    const fakeAddress = createFakeAddress()
    const primaryAddressDetails = {
      ...fakeAddress,
      addressLine2: undefined,
      addressLine4: undefined,
      hasAnotherAddress: 'No',
    }
    const interestedParties = createFakeInterestedParties('Prison', 'Probation', 'Liverpool Prison', 'North West')
    const probationDeliveryUnit = { unit: 'Blackburn' }
    const monitoringOrderTypeDescription = {
      pilot: 'GPS acquisitive crime (EMAC)',
      sentenceType: 'Standard Determinate Sentence',
      typeOfAcquistiveCrime: 'Aggravated Burglary',
      policeForceArea: 'Kent',
      monitoringCondition: ['Curfew', 'Exclusion zone monitoring', 'Trail monitoring'],
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
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 20), // 20 days
      curfewAdditionalDetails: '',
    }
    const curfewNights = ['FRIDAY', 'SATURDAY', 'SUNDAY']
    const curfewTimetable = curfewNights.flatMap((day: string) => [
      {
        day,
        startTime: '19:00:00',
        endTime: '07:00:00',
        addresses: [curfewReleaseDetails.address],
      },
    ])
    const primaryEnforcementZoneDetails = {
      zoneType: 'Exclusion zone',
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
      endDate: new Date(new Date().getTime() + 3000 * 60 * 60 * 24 * 10), // 30 days
      description: 'A test description: Lorum ipsum dolar sit amet...',
      duration: 'A test duration: one, two, three...',
      anotherZone: 'No',
      name: 'test name',
    }
    // Disabled as alcohol monitoring can't currently be selected as a monitoring type.
    // const alcoholMonitoringOrder = {
    //   startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 15), // 15 days
    //   monitoringType: 'Alcohol abstinence',
    //   installLocation: `at installation address: ${installationAddressDetails}`,
    // }
    const trailMonitoringOrder = {
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 15), // 15 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 20), // 20 days
    }
    const installationAndRisk = {
      offence: 'Sexual offences',
      possibleRisk: 'Sex offender',
      riskCategory: 'Children under the age of 18 are living at the property',
      riskDetails: 'No risk',
    }

    it('Should successfully submit the order to the FMS API', () => {
      createNewOrder({ notifyingOrganisation: interestedParties })

      const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      orderSummaryPage.fillInNewOrderWith({
        deviceWearerDetails,
        responsibleAdultDetails,
        primaryAddressDetails,
        secondaryAddressDetails: undefined,
        interestedParties,
        installationAndRisk,
        monitoringOrderTypeDescription,
        installationAddressDetails: undefined,
        curfewReleaseDetails,
        curfewConditionDetails,
        curfewTimetable,
        enforcementZoneDetails: primaryEnforcementZoneDetails,
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
      if (takeScreenshots) cy.screenshot('31. submitSuccessPage', { overwrite: true })
      submitSuccessPage.backToYourApplications.click()

      const indexPage = Page.verifyOnPage(IndexPage)
      if (takeScreenshots) cy.screenshot('32. indexPageAfterSubmission', { overwrite: true })
      indexPage.searchNav.click()

      const searchPage = Page.verifyOnPage(SearchPage)
      if (takeScreenshots) cy.screenshot('33. searchPageAfterSubmission', { overwrite: true })
      searchPage.searchBox.type(deviceWearerDetails.lastName)
      searchPage.searchButton.click()
      searchPage.ordersList.contains(deviceWearerDetails.fullName)
    })
  })
})
