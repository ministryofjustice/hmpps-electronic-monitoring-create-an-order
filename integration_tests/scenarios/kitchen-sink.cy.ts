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
import AboutDeviceWearerPage from '../pages/order/about-the-device-wearer/device-wearer'
import ResponsibleAdultPage from '../pages/order/about-the-device-wearer/responsible-adult-details'
import ContactDetailsPage from '../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../pages/order/contact-information/no-fixed-abode'
import PrimaryAddressPage from '../pages/order/contact-information/primary-address'
import SecondaryAddressPage from '../pages/order/contact-information/secondary-address'
import TertiaryAddressPage from '../pages/order/contact-information/tertiary-adddress'
import InterestedPartiesPage from '../pages/order/contact-information/interested-parties'
import MonitoringConditionsPage from '../pages/order/monitoring-conditions'
// Disabled as alcohol monitoring can't currently be selected as a monitoring type.
// import AlcoholMonitoringPage from '../pages/order/monitoring-conditions/alcohol-monitoring'
import SubmitSuccessPage from '../pages/order/submit-success'
import InstallationAddressPage from '../pages/order/monitoring-conditions/installation-address'
import CurfewReleaseDatePage from '../pages/order/monitoring-conditions/curfew-release-date'
import CurfewTimetablePage from '../pages/order/monitoring-conditions/curfew-timetable'
import InstallationAndRiskPage from '../pages/order/installationAndRisk'
import CurfewConditionsPage from '../pages/order/monitoring-conditions/curfew-conditions'
import EnforcementZonePage from '../pages/order/monitoring-conditions/enforcement-zone'
import TrailMonitoringPage from '../pages/order/monitoring-conditions/trail-monitoring'
import AttachmentSummaryPage from '../pages/order/attachments/summary'
import UploadPhotoIdPage from '../pages/order/attachments/uploadPhotoId'
import UploadLicencePage from '../pages/order/attachments/uploadLicence'
import DeviceWearerCheckYourAnswersPage from '../pages/order/about-the-device-wearer/check-your-answers'
import MonitoringConditionsCheckYourAnswersPage from '../pages/order/monitoring-conditions/check-your-answers'
import ContactInformationCheckYourAnswersPage from '../pages/order/contact-information/check-your-answers'
import IdentityNumbersPage from '../pages/order/about-the-device-wearer/identity-numbers'
import InstallationAndRiskCheckYourAnswersPage from '../pages/order/installation-and-risk/check-your-answers'
import ProbationDeliveryUnitPage from '../pages/order/contact-information/probation-delivery-unit'
import CurfewAdditionalDetailsPage from '../pages/order/monitoring-conditions/curfew-additional-details'
import InstallationLocationPage from '../pages/order/monitoring-conditions/installation-location'

context('The kitchen sink', () => {
  const takeScreenshots = config.screenshots_enabled
  const fmsCaseId: string = uuidv4()
  const hmppsDocumentId: string = uuidv4()
  const files = {
    photoId: {
      contents: 'cypress/fixtures/profile.jpeg',
      fileName: 'profile.jpeg',
      type: 'PHOTO_ID',
    },
    licence: {
      contents: 'cypress/fixtures/test.pdf',
      fileName: 'test.pdf',
      type: 'LICENCE',
    },
  }

  const cacheOrderId = () => {
    cy.url().then((url: string) => {
      const parts = url.replace(Cypress.config().baseUrl, '').split('/')
      const orderId = parts[2]
      cy.wrap(orderId).as('orderId')
    })
  }

  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER'],
    })

    cy.task('stubFMSCreateDeviceWearer', {
      httpStatus: 200,
      response: { result: [{ id: fmsCaseId, message: '' }] },
    })

    cy.task('stubFMSCreateMonitoringOrder', {
      httpStatus: 200,
      response: { result: [{ id: uuidv4(), message: '' }] },
    })

    cy.task('stubFmsUploadAttachment', {
      httpStatus: 200,
      fileName: files.photoId.fileName,
      deviceWearerId: fmsCaseId,
      response: { status: 200, result: {} },
    })
    cy.task('stubUploadDocument', {
      id: '(.*)',
      httpStatus: 200,
      response: {
        documentUuid: hmppsDocumentId,
        documentFilename: files.photoId.fileName,
        filename: files.photoId.fileName,
        fileExtension: files.photoId.fileName.split('.').pop(),
        mimeType: 'image/jpeg',
      },
    })
    cy.readFile(files.photoId.contents, 'base64').then(content => {
      cy.task('stubGetDocument', {
        id: '(.*)',
        httpStatus: 200,
        contextType: 'image/jpeg',
        fileBase64Body: content,
      })
    })

    cy.task('stubFmsUploadAttachment', {
      httpStatus: 200,
      fileName: files.licence.fileName,
      deviceWearerId: fmsCaseId,
      response: { status: 200, result: {} },
    })
    cy.task('stubUploadDocument', {
      id: '(.*)',
      httpStatus: 200,
      response: {
        documentUuid: hmppsDocumentId,
        documentFilename: files.licence.fileName,
        filename: files.licence.fileName,
        fileExtension: files.licence.fileName.split('.').pop(),
        mimeType: 'application/pdf',
      },
    })
    cy.readFile(files.licence.contents, 'base64').then(content => {
      cy.task('stubGetDocument', {
        id: '(.*)',
        httpStatus: 200,
        contextType: 'application/pdf',
        fileBase64Body: content,
      })
    })
  })

  const adultDeviceWearerDetails = {
    ...createFakeAdultDeviceWearer(),
    interpreterRequired: true,
    language: 'Flemish (Dutch)',
    hasFixedAddress: 'Yes',
  }
  const youthDeviceWearerDetails = {
    ...createFakeYouthDeviceWearer(),
    interpreterRequired: false,
    hasFixedAddress: 'Yes',
  }
  const responsibleAdultDetails = createFakeResponsibleAdult()
  const primaryAddressDetails = { ...createFakeAddress(), hasAnotherAddress: 'Yes' }
  const secondaryAddressDetails = { ...createFakeAddress(), hasAnotherAddress: 'Yes' }
  const tertiaryAddressDetails = createFakeAddress()
  const installationAddressDetails = createFakeAddress()
  const interestedParties = createFakeInterestedParties('Prison', 'Probation', 'Elmley Prison', 'Kent, Surrey & Sussex')
  const probationDeliveryUnit = { unit: 'Surrey' }
  const monitoringConditions = {
    startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
    endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 40), // 40 days
    isPartOfACP: 'No',
    isPartOfDAPOL: 'No',
    orderType: 'Post Release',
    pilot: 'GPS Acquisitive Crime Parole',
    conditionType: 'Bail Order',
    monitoringRequired: [
      'Curfew',
      'Exclusion zone monitoring',
      'Trail monitoring',
      // 'Mandatory attendance monitoring',
      // Disabled as alcohol monitoring can't currently be selected as a monitoring type.
      // 'Alcohol monitoring',
    ],
  }
  const curfewReleaseDetails = {
    releaseDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day
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
    anotherZone: 'Yes',
  }
  const secondEnforcementZoneDetails = {
    zoneType: 'Exclusion zone',
    startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 100), // 100 days
    endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 200), // 200 days
    uploadFile: files.licence,
    description: 'A second test description: Lorum ipsum dolar sit amet...',
    duration: 'A second test duration: one, two, three...',
    anotherZone: 'No',
  }
  // const attendanceMonitoringOrder = {
  //   startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 15),
  //   endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 35),
  //   purpose: 'Not to leave boundary of M60',
  //   appointmentDay: 'Monday',
  //   startTime: { hours: '10', minutes: '00' },
  //   endTime: { hours: '11', minutes: '00' },
  //   address: createFakeAddress(),
  //   addAnother: 'No',
  // }

  const installationAndRisk = {
    offence: 'Robbery',
    possibleRisk: 'Sex offender',
    riskCategory: 'Children under the age of 18 are living at the property',
    mappaLevel: 'MAPPA 1',
    mappaCaseType: 'Serious Organised Crime',
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

  // const variationDetails = {
  //   variationType: 'The device wearer’s address',
  //   variationDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 20),
  // }

  // const variationNewAddress = { ...createFakeAddress(), hasAnotherAddress: 'No' }

  const testScenarios = [
    { name: 'Adult Device Wearer', deviceWearerDetails: adultDeviceWearerDetails, responsibleAdultDetails: null },
    { name: 'Youth Device Wearer', deviceWearerDetails: youthDeviceWearerDetails, responsibleAdultDetails },
  ]

  testScenarios.forEach(scenario => {
    it(`should run the full end-to-end "kitchen-sink" flow for a ${scenario.name}`, () => {
      cy.signIn()

      let indexPage = Page.verifyOnPage(IndexPage)
      if (takeScreenshots) cy.screenshot(`01. indexPage - ${scenario.name}`, { overwrite: true })
      indexPage.newOrderFormButton.click()

      let orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      if (takeScreenshots) cy.screenshot(`02. orderSummaryPage - ${scenario.name}`, { overwrite: true })
      cacheOrderId()

      // About the Device Wearer
      orderSummaryPage.aboutTheDeviceWearerTask.click()
      let aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
      aboutDeviceWearerPage.form.saveAndContinueButton.click()
      aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
      if (takeScreenshots)
        cy.screenshot(`03. aboutDeviceWearerPage - validation - ${scenario.name}`, { overwrite: true })
      aboutDeviceWearerPage.form.fillInWith(scenario.deviceWearerDetails)
      if (takeScreenshots) cy.screenshot(`03. aboutDeviceWearerPage - ${scenario.name}`, { overwrite: true })
      aboutDeviceWearerPage.form.saveAndContinueButton.click()

      if (scenario.responsibleAdultDetails) {
        let responsibleAdultPage = Page.verifyOnPage(ResponsibleAdultPage)
        responsibleAdultPage.form.saveAndContinueButton.click()
        responsibleAdultPage = Page.verifyOnPage(ResponsibleAdultPage)
        if (takeScreenshots)
          cy.screenshot(`03a. responsibleAdultPage - validation - ${scenario.name}`, { overwrite: true })
        responsibleAdultPage.form.fillInWith(scenario.responsibleAdultDetails)
        if (takeScreenshots) cy.screenshot(`03a. responsibleAdultPage - ${scenario.name}`, { overwrite: true })
        responsibleAdultPage.form.saveAndContinueButton.click()
      }

      const identityNumbersPage = Page.verifyOnPage(IdentityNumbersPage)
      identityNumbersPage.form.fillInWith(scenario.deviceWearerDetails)
      if (takeScreenshots) cy.screenshot(`04. identityNumbersPage - ${scenario.name}`, { overwrite: true })
      identityNumbersPage.form.saveAndContinueButton.click()

      const deviceWearerCheckYourAnswersPage = Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')
      deviceWearerCheckYourAnswersPage.continueButton().click()

      // Contact Information
      let contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
      contactDetailsPage.form.fillInWith({ contactNumber: '0123456789' })
      contactDetailsPage.form.saveAndContinueButton.click()
      contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
      if (takeScreenshots) cy.screenshot('05. contactDetailsPage - validation', { overwrite: true })
      contactDetailsPage.form.fillInWith({ contactNumber: '{selectall}{del}' })
      contactDetailsPage.form.fillInWith(scenario.deviceWearerDetails)
      if (takeScreenshots) cy.screenshot('05. contactDetailsPage', { overwrite: true })
      contactDetailsPage.form.saveAndContinueButton.click()

      let noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
      noFixedAbode.form.saveAndContinueButton.click()
      noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
      if (takeScreenshots) cy.screenshot(`06. noFixedAbode - validation - ${scenario.name}`, { overwrite: true })
      noFixedAbode.form.fillInWith(scenario.deviceWearerDetails)
      if (takeScreenshots) cy.screenshot(`06. noFixedAbode - ${scenario.name}`, { overwrite: true })
      noFixedAbode.form.saveAndContinueButton.click()

      let primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
      primaryAddressPage.form.saveAndContinueButton.click()
      primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
      if (takeScreenshots) cy.screenshot(`07. primaryAddressPage - validation - ${scenario.name}`, { overwrite: true })
      primaryAddressPage.form.fillInWith(primaryAddressDetails)
      if (takeScreenshots) cy.screenshot(`07. primaryAddressPage - ${scenario.name}`, { overwrite: true })
      primaryAddressPage.form.saveAndContinueButton.click()

      let secondaryAddressPage = Page.verifyOnPage(SecondaryAddressPage)
      secondaryAddressPage.form.saveAndContinueButton.click()
      secondaryAddressPage = Page.verifyOnPage(SecondaryAddressPage)
      if (takeScreenshots)
        cy.screenshot(`08. secondaryAddressPage - validation - ${scenario.name}`, { overwrite: true })
      secondaryAddressPage.form.fillInWith(secondaryAddressDetails)
      if (takeScreenshots) cy.screenshot(`08. secondaryAddressPage - ${scenario.name}`, { overwrite: true })
      secondaryAddressPage.form.saveAndContinueButton.click()

      let tertiaryAddressPage = Page.verifyOnPage(TertiaryAddressPage)
      tertiaryAddressPage.form.saveAndContinueButton.click()
      tertiaryAddressPage = Page.verifyOnPage(TertiaryAddressPage)
      if (takeScreenshots) cy.screenshot(`09. tertiaryAddressPage - validation - ${scenario.name}`, { overwrite: true })
      tertiaryAddressPage.form.fillInWith(tertiaryAddressDetails)
      if (takeScreenshots) cy.screenshot(`09. tertiaryAddressPage - ${scenario.name}`, { overwrite: true })
      tertiaryAddressPage.form.saveAndContinueButton.click()
      // no validation
      const interestedPartiesPage = Page.verifyOnPage(InterestedPartiesPage)
      interestedPartiesPage.form.fillInWith(interestedParties)
      if (takeScreenshots) cy.screenshot(`10. interestedPartiesPage - ${scenario.name}`, { overwrite: true })
      interestedPartiesPage.form.saveAndContinueButton.click()

      if (interestedParties.responsibleOrganisation === 'Probation' && probationDeliveryUnit) {
        const probationDeliveryUnitPage = Page.verifyOnPage(ProbationDeliveryUnitPage)
        probationDeliveryUnitPage.form.fillInWith(probationDeliveryUnit)
        probationDeliveryUnitPage.form.saveAndContinueButton.click()
      }
      const contactInformationCheckYourAnswersPage = Page.verifyOnPage(
        ContactInformationCheckYourAnswersPage,
        'Check your answer',
      )
      contactInformationCheckYourAnswersPage.continueButton().click()

      // no validation
      let installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
      installationAndRiskPage.form.saveAndContinueButton.click()
      installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
      if (takeScreenshots)
        cy.screenshot(`11. installationAndRiskPage - validation - ${scenario.name}`, { overwrite: true })
      installationAndRiskPage.form.fillInWith(installationAndRisk)
      if (takeScreenshots) cy.screenshot(`11. installationAndRiskPage - ${scenario.name}`, { overwrite: true })
      installationAndRiskPage.form.saveAndContinueButton.click()

      const installationAndRiskCheckYourAnswersPage = Page.verifyOnPage(
        InstallationAndRiskCheckYourAnswersPage,
        'Check your answer',
      )
      installationAndRiskCheckYourAnswersPage.continueButton().click()

      // Monitoring Conditions
      let monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
      monitoringConditionsPage.form.saveAndContinueButton.click()
      monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
      if (takeScreenshots)
        cy.screenshot(`12. monitoringConditionsPage - validation - ${scenario.name}`, { overwrite: true })
      monitoringConditionsPage.form.fillInWith(monitoringConditions)
      if (takeScreenshots) cy.screenshot(`12. monitoringConditionsPage - ${scenario.name}`, { overwrite: true })
      monitoringConditionsPage.form.saveAndContinueButton.click()

      let installationLocationPage = Page.verifyOnPage(InstallationLocationPage)
      installationLocationPage.form.saveAndContinueButton.click()
      installationLocationPage = Page.verifyOnPage(InstallationLocationPage)
      if (takeScreenshots)
        cy.screenshot(`13. installationLocationPage - validation - ${scenario.name}`, { overwrite: true })
      installationLocationPage.form.fillInWith({ location: 'At another address' })
      if (takeScreenshots) cy.screenshot(`13. installationLocationPage - ${scenario.name}`, { overwrite: true })
      installationLocationPage.form.saveAndContinueButton.click()

      let installationAddress = Page.verifyOnPage(InstallationAddressPage)
      installationAddress.form.saveAndContinueButton.click()
      installationAddress = Page.verifyOnPage(InstallationAddressPage)
      if (takeScreenshots)
        cy.screenshot(`14. installationAddressPage - validation - ${scenario.name}`, { overwrite: true })
      installationAddress.form.fillInWith(installationAddressDetails)
      if (takeScreenshots) cy.screenshot(`14. installationAddressPage - ${scenario.name}`, { overwrite: true })
      installationAddress.form.saveAndContinueButton.click()

      let curfewReleaseDatePage = Page.verifyOnPage(CurfewReleaseDatePage)
      curfewReleaseDatePage.form.saveAndContinueButton.click()
      curfewReleaseDatePage = Page.verifyOnPage(CurfewReleaseDatePage)
      if (takeScreenshots)
        cy.screenshot(`15. curfewReleaseDatePage - validation - ${scenario.name}`, { overwrite: true })
      curfewReleaseDatePage.form.fillInWith(curfewReleaseDetails)
      if (takeScreenshots) cy.screenshot(`15. curfewReleaseDatePage - ${scenario.name}`, { overwrite: true })
      curfewReleaseDatePage.form.saveAndContinueButton.click()

      let curfewConditionsPage = Page.verifyOnPage(CurfewConditionsPage)
      curfewConditionsPage.form.saveAndContinueButton.click()
      curfewConditionsPage = Page.verifyOnPage(CurfewConditionsPage)
      if (takeScreenshots)
        cy.screenshot(`16. curfewConditionsPage - validation - ${scenario.name}`, { overwrite: true })
      curfewConditionsPage.form.fillInWith(curfewConditionDetails)
      if (takeScreenshots) cy.screenshot(`16. curfewConditionsPage - ${scenario.name}`, { overwrite: true })
      curfewConditionsPage.form.saveAndContinueButton.click()

      let curfewAdditionalDetailsPage = Page.verifyOnPage(CurfewAdditionalDetailsPage)
      curfewAdditionalDetailsPage.form.saveAndContinueButton.click()
      curfewAdditionalDetailsPage = Page.verifyOnPage(CurfewAdditionalDetailsPage)
      if (takeScreenshots)
        cy.screenshot(`17. curfewAdditionalDetailsPage - validation - ${scenario.name}`, { overwrite: true })
      curfewAdditionalDetailsPage.form.fillInWith(curfewConditionDetails)
      if (takeScreenshots) cy.screenshot(`17. curfewAdditionalDetailsPage - ${scenario.name}`, { overwrite: true })
      curfewAdditionalDetailsPage.form.saveAndContinueButton.click()

      let curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
      curfewTimetablePage.form.saveAndContinueButton.click()
      curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
      if (takeScreenshots) cy.screenshot(`18. curfewTimetablePage - validation - ${scenario.name}`, { overwrite: true })
      curfewTimetablePage.form.fillInWith(curfewTimetable)
      if (takeScreenshots) cy.screenshot(`18. curfewTimetablePage - ${scenario.name}`, { overwrite: true })
      curfewTimetablePage.form.saveAndContinueButton.click()

      let enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
      enforcementZonePage.form.saveAndContinueButton.click()
      enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
      if (takeScreenshots) cy.screenshot(`19. enforcementZonePage - validation - ${scenario.name}`, { overwrite: true })
      enforcementZonePage.form.fillInWith(primaryEnforcementZoneDetails)
      if (takeScreenshots) cy.screenshot(`19. enforcementZonePage - ${scenario.name}`, { overwrite: true })
      enforcementZonePage.form.saveAndContinueButton.click()
      enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
      enforcementZonePage.form.saveAndContinueButton.click()
      enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
      if (takeScreenshots) cy.screenshot(`19. enforcementZonePage - validation - ${scenario.name}`, { overwrite: true })
      enforcementZonePage.form.fillInWith(secondEnforcementZoneDetails)
      if (takeScreenshots) cy.screenshot(`19. enforcementZonePage - ${scenario.name}`, { overwrite: true })
      enforcementZonePage.form.saveAndContinueButton.click()

      let trailMonitoringPage = Page.verifyOnPage(TrailMonitoringPage)
      trailMonitoringPage.form.saveAndContinueButton.click()
      trailMonitoringPage = Page.verifyOnPage(TrailMonitoringPage)
      if (takeScreenshots) cy.screenshot(`20. trailMonitoringPage - validation - ${scenario.name}`, { overwrite: true })
      trailMonitoringPage.form.fillInWith(trailMonitoringOrder)
      if (takeScreenshots) cy.screenshot(`20. trailMonitoringPage - ${scenario.name}`, { overwrite: true })
      trailMonitoringPage.form.saveAndContinueButton.click()

      // Disabled as alcohol monitoring can't currently be selected as a monitoring type.
      // let alcoholMonitoringPage = Page.verifyOnPage(AlcoholMonitoringPage)
      // alcoholMonitoringPage.form.saveAndContinueButton.click()
      // alcoholMonitoringPage = Page.verifyOnPage(AlcoholMonitoringPage)
      // if (takeScreenshots) cy.screenshot('21. alcoholMonitoringPage - validation', { overwrite: true })
      // alcoholMonitoringPage.form.fillInWith(alcoholMonitoringOrder)
      // if (takeScreenshots) cy.screenshot('21. alcoholMonitoringPage', { overwrite: true })
      // alcoholMonitoringPage.form.saveAndContinueButton.click()

      const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(
        MonitoringConditionsCheckYourAnswersPage,
        'Check your answer',
      )
      monitoringConditionsCheckYourAnswersPage.continueButton().click()

      // Attachments
      let attachmentPage = Page.verifyOnPage(AttachmentSummaryPage)
      attachmentPage.photoIdTask.addAction.click()
      const uploadPhotoIdPage = Page.verifyOnPage(UploadPhotoIdPage)
      uploadPhotoIdPage.form.fillInWith({ file: files.photoId })
      uploadPhotoIdPage.form.saveAndContinueButton.click()

      attachmentPage = Page.verifyOnPage(AttachmentSummaryPage)
      attachmentPage.licenceTask.addAction.click()
      const uploadLicencePage = Page.verifyOnPage(UploadLicencePage)
      uploadLicencePage.form.fillInWith({ file: files.licence })
      uploadLicencePage.form.saveAndContinueButton.click()

      const filledAttachmentPage = Page.verifyOnPage(AttachmentSummaryPage)
      if (takeScreenshots) cy.screenshot(`22. attachmentPage - ${scenario.name}`, { overwrite: true })
      filledAttachmentPage.backToSummaryButton.click()

      // Submit Order
      orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      orderSummaryPage.submitOrderButton.click()

      const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
      if (takeScreenshots) cy.screenshot(`23. submitSuccessPage - ${scenario.name}`, { overwrite: true })
      submitSuccessPage.backToYourApplications.click()

      indexPage = Page.verifyOnPage(IndexPage)
      if (takeScreenshots) cy.screenshot(`24. indexPageAfterSubmission - ${scenario.name}`, { overwrite: true })
      indexPage.SubmittedOrderFor(scenario.deviceWearerDetails.fullName).should('exist')

      // Variations WIP
      // indexPage.newVariationFormButton.click()
      // orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      // cacheOrderId() // The URL changes for a variation, so we need to get the new orderId
      // orderSummaryPage.variationDetailsTask.click()

      // const variationDetailsPage = Page.verifyOnPage(VariationDetailsPage)
      // variationDetailsPage.form.fillInWith(variationDetails)
      // if (takeScreenshots) cy.screenshot(`24. variationDetailsPage - ${scenario.name}`, { overwrite: true })
      // variationDetailsPage.form.saveAndContinueButton.click()

      // const variationAboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
      // variationAboutDeviceWearerPage.form.saveAndContinueButton.click()
      // if (scenario.responsibleAdultDetails) {
      //   const variationResponsibleAdultPage = Page.verifyOnPage(ResponsibleAdultPage)
      //   variationResponsibleAdultPage.form.saveAndContinueButton.click()
      // }
      // const variationIdentityNumbersPage = Page.verifyOnPage(IdentityNumbersPage)
      // variationIdentityNumbersPage.form.saveAndContinueButton.click()
    })
  })
})
