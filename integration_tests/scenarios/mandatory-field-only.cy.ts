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
import ContactDetailsPage from '../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../pages/order/contact-information/no-fixed-abode'
import PrimaryAddressPage from '../pages/order/contact-information/primary-address'
import InterestedPartiesPage from '../pages/order/contact-information/interested-parties'
import MonitoringConditionsPage from '../pages/order/monitoring-conditions'
// Disabled as alcohol monitoring can't currently be selected as a monitoring type.
// import AlcoholMonitoringPage from '../pages/order/monitoring-conditions/alcohol-monitoring'
import SubmitSuccessPage from '../pages/order/submit-success'
import CurfewReleaseDatePage from '../pages/order/monitoring-conditions/curfew-release-date'
import CurfewTimetablePage from '../pages/order/monitoring-conditions/curfew-timetable'
import InstallationAndRiskPage from '../pages/order/installationAndRisk'
import CurfewConditionsPage from '../pages/order/monitoring-conditions/curfew-conditions'
import EnforcementZonePage from '../pages/order/monitoring-conditions/enforcement-zone'
import TrailMonitoringPage from '../pages/order/monitoring-conditions/trail-monitoring'
import ResponsibleAdultPage from '../pages/order/about-the-device-wearer/responsible-adult-details'
import AttachmentSummaryPage from '../pages/order/attachments/summary'
import DeviceWearerCheckYourAnswersPage from '../pages/order/about-the-device-wearer/check-your-answers'
import MonitoringConditionsCheckYourAnswersPage from '../pages/order/monitoring-conditions/check-your-answers'
import ContactInformationCheckYourAnswersPage from '../pages/order/contact-information/check-your-answers'
import IdentityNumbersPage from '../pages/order/about-the-device-wearer/identity-numbers'
import InstallationAndRiskCheckYourAnswersPage from '../pages/order/installation-and-risk/check-your-answers'
import ProbationDeliveryUnitPage from '../pages/order/contact-information/probation-delivery-unit'
import CurfewAdditionalDetailsPage from '../pages/order/monitoring-conditions/curfew-additional-details'
import UploadLicencePage from '../pages/order/attachments/uploadLicence'
import HavePhotoPage from '../pages/order/attachments/havePhoto'

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
      fileName: files.licence.fileName,
      deviceWearerId: fmsCaseId,
      response: {
        status: 200,
        result: {},
      },
    })

    cy.task('stubUploadDocument', {
      id: '(.*)',
      httpStatus: 200,
      response: {
        documentUuid: hmppsDocumentId,
        documentFilename: files.licence.fileName,
        filename: files.licence.fileName,
        fileExtension: files.licence.fileName.split('.')[1],
        mimeType: 'application/pdf',
      },
    })

    cy.readFile(files.licence.contents, 'base64').then(content => {
      cy.task('stubGetDocument', {
        id: '(.*)',
        httpStatus: 200,
        contextType: 'image/pdf',
        fileBase64Body: content,
      })
    })
  })

  context('Fill in adult mandatory only fields and screenshot', () => {
    const fullDeviceWearerDetails = createFakeAdultDeviceWearer()
    const deviceWearerDetails = {
      firstNames: fullDeviceWearerDetails.firstNames,
      lastName: fullDeviceWearerDetails.lastName,
      fullName: fullDeviceWearerDetails.fullName,
      dob: fullDeviceWearerDetails.dob,
      is18: true,
      sex: fullDeviceWearerDetails.sex,
      genderIdentity: fullDeviceWearerDetails.genderIdentity,
      interpreterRequired: false,
      contactNumber: undefined,
      hasFixedAddress: 'Yes',
    }
    const identityNumbers = {
      nomisId: fullDeviceWearerDetails.nomisId,
      deliusId: fullDeviceWearerDetails.deliusId,
      pncId: fullDeviceWearerDetails.pncId,
      prisonNumber: fullDeviceWearerDetails.prisonNumber,
      homeOfficeReferenceNumber: fullDeviceWearerDetails.homeOfficeReferenceNumber,
    }
    const fakeAddress = createFakeAddress()
    const primaryAddressDetails = {
      ...fakeAddress,
      line2: undefined,
      line4: undefined,
      hasAnotherAddress: 'No',
    }

    const interestedParties = createFakeInterestedParties('Prison', 'Probation', null, 'North West')
    const probationDeliveryUnit = { unit: 'Blackburn' }
    const monitoringConditions = {
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 11), // 11 days
      orderType: 'Post Release',
      pilot: 'GPS Acquisitive Crime Parole',
      conditionType: 'Licence condition',
      sentenceType: 'Life Sentence',
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
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 20), // 20 days
      addresses: [/Main address/],
      curfewAdditionalDetails: '',
    }
    const curfewNights = ['FRIDAY', 'SATURDAY', 'SUNDAY']
    const curfewTimetable = curfewNights.flatMap((day: string) => [
      {
        day,
        startTime: '19:00:00',
        endTime: '07:00:00',
        addresses: curfewConditionDetails.addresses,
      },
    ])
    const primaryEnforcementZoneDetails = {
      zoneType: 'Exclusion zone',
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
      endDate: new Date(new Date().getTime() + 3000 * 60 * 60 * 24 * 10), // 30 days
      description: 'A test description: Lorum ipsum dolar sit amet...',
      duration: 'A test duration: one, two, three...',
      anotherZone: 'No',
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
      possibleRisk: 'Sex offender',
      riskCategory: 'Children under the age of 18 are living at the property',
      riskDetails: 'No risk',
    }
    it('Should successfully submit the order to the FMS API', () => {
      cy.signIn()

      let indexPage = Page.verifyOnPage(IndexPage)
      if (takeScreenshots) cy.screenshot('01. indexPage', { overwrite: true })
      indexPage.newOrderFormButton.click()

      let orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      if (takeScreenshots) cy.screenshot('02. orderSummaryPage - minimum', { overwrite: true })
      orderSummaryPage.aboutTheDeviceWearerTask.click()

      let aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
      aboutDeviceWearerPage.form.saveAndContinueButton.click()
      aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
      if (takeScreenshots) cy.screenshot('03. aboutDeviceWearerPage - validation', { overwrite: true })
      aboutDeviceWearerPage.form.fillInWith(deviceWearerDetails)
      if (takeScreenshots) cy.screenshot('03. aboutDeviceWearerPage - minimum', { overwrite: true })
      aboutDeviceWearerPage.form.saveAndContinueButton.click()

      const identityNumbersPage = Page.verifyOnPage(IdentityNumbersPage)
      identityNumbersPage.form.fillInWith(identityNumbers)
      if (takeScreenshots) cy.screenshot('04. identityNumbersPage', { overwrite: true })
      identityNumbersPage.form.saveAndContinueButton.click()

      const deviceWearerCheckYourAnswersPage = Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')
      deviceWearerCheckYourAnswersPage.continueButton().click()

      let contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
      contactDetailsPage.form.fillInWith({ contactNumber: '0123456789' })
      contactDetailsPage.form.saveAndContinueButton.click()
      if (takeScreenshots) cy.screenshot('05. contactDetailsPage - validation', { overwrite: true })
      contactDetailsPage.form.fillInWith({ contactNumber: '{selectall}{del}' })
      contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
      if (takeScreenshots) cy.screenshot('05. contactDetailsPage', { overwrite: true })
      contactDetailsPage.form.saveAndContinueButton.click()

      let noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
      noFixedAbode.form.saveAndContinueButton.click()
      noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
      if (takeScreenshots) cy.screenshot('06. noFixedAbode - validation', { overwrite: true })
      noFixedAbode.form.fillInWith(deviceWearerDetails)
      if (takeScreenshots) cy.screenshot('06. noFixedAbode - minimum', { overwrite: true })
      noFixedAbode.form.saveAndContinueButton.click()

      let primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
      primaryAddressPage.form.saveAndContinueButton.click()
      primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
      if (takeScreenshots) cy.screenshot('07. primaryAddressPage - validation', { overwrite: true })
      primaryAddressPage.form.fillInWith(primaryAddressDetails)
      if (takeScreenshots) cy.screenshot('07. primaryAddressPage - minimum', { overwrite: true })
      primaryAddressPage.form.saveAndContinueButton.click()

      // no validation
      const interestedPartiesPage = Page.verifyOnPage(InterestedPartiesPage)
      if (takeScreenshots) cy.screenshot('10. notifyingOrganisationPage - validation', { overwrite: true })
      interestedPartiesPage.form.fillInWith(interestedParties)
      if (takeScreenshots) cy.screenshot('10. notifyingOrganisationPage - minimum', { overwrite: true })
      interestedPartiesPage.form.saveAndContinueButton.click()

      const probationDeliveryUnitPage = Page.verifyOnPage(ProbationDeliveryUnitPage)
      probationDeliveryUnitPage.form.fillInWith(probationDeliveryUnit)
      probationDeliveryUnitPage.form.saveAndContinueButton.click()

      const contactInformationCheckYourAnswersPage = Page.verifyOnPage(
        ContactInformationCheckYourAnswersPage,
        'Check your answer',
      )
      contactInformationCheckYourAnswersPage.continueButton().click()

      // no validation
      let installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
      installationAndRiskPage.form.saveAndContinueButton.click()
      installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
      if (takeScreenshots) cy.screenshot('11. installationAndRiskPage - validation', { overwrite: true })
      installationAndRiskPage.form.fillInWith(installationAndRisk)
      if (takeScreenshots) cy.screenshot('11. installationAndRiskPage - minimum', { overwrite: true })
      installationAndRiskPage.form.saveAndContinueButton.click()

      const installationAndRiskCheckYourAnswersPage = Page.verifyOnPage(
        InstallationAndRiskCheckYourAnswersPage,
        'Check your answer',
      )
      if (takeScreenshots)
        cy.screenshot('11. installationAndRiskCheckYourAnswersPage - validation', { overwrite: true })
      // installationAndRiskPage.fillInWith()
      if (takeScreenshots) cy.screenshot('11. installationAndRiskCheckYourAnswersPage - minimum', { overwrite: true })
      installationAndRiskCheckYourAnswersPage.continueButton().click()

      let monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
      monitoringConditionsPage.form.saveAndContinueButton.click()
      monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
      if (takeScreenshots) cy.screenshot('12. monitoringConditionsPage - validation', { overwrite: true })
      monitoringConditionsPage.form.fillInWith(monitoringConditions)
      if (takeScreenshots) cy.screenshot('12. monitoringConditionsPage - minimum', { overwrite: true })
      monitoringConditionsPage.form.saveAndContinueButton.click()

      let curfewReleaseDatePage = Page.verifyOnPage(CurfewReleaseDatePage)
      curfewReleaseDatePage.form.saveAndContinueButton.click()
      curfewReleaseDatePage = Page.verifyOnPage(CurfewReleaseDatePage)
      if (takeScreenshots) cy.screenshot('14. curfewReleaseDatePage - validation', { overwrite: true })
      curfewReleaseDatePage.form.fillInWith(curfewReleaseDetails)
      if (takeScreenshots) cy.screenshot('14. curfewReleaseDatePage - minimum', { overwrite: true })
      curfewReleaseDatePage.form.saveAndContinueButton.click()

      let curfewConditionsPage = Page.verifyOnPage(CurfewConditionsPage)
      curfewConditionsPage.form.saveAndContinueButton.click()
      curfewConditionsPage = Page.verifyOnPage(CurfewConditionsPage)
      if (takeScreenshots) cy.screenshot('15. curfewConditionsPage - validation', { overwrite: true })
      curfewConditionsPage.form.fillInWith(curfewConditionDetails)
      if (takeScreenshots) cy.screenshot('15. curfewConditionsPage - minimum', { overwrite: true })
      curfewConditionsPage.form.saveAndContinueButton.click()

      let curfewAdditionalDetailsPage = Page.verifyOnPage(CurfewAdditionalDetailsPage)
      curfewAdditionalDetailsPage.form.saveAndContinueButton.click()
      curfewAdditionalDetailsPage = Page.verifyOnPage(CurfewAdditionalDetailsPage)
      if (takeScreenshots) cy.screenshot('16. curfewAdditionalDetailsPage - validation', { overwrite: true })
      curfewAdditionalDetailsPage.form.fillInWith(curfewConditionDetails)
      if (takeScreenshots) cy.screenshot('16. curfewAdditionalDetailsPage', { overwrite: true })
      curfewAdditionalDetailsPage.form.saveAndContinueButton.click()

      let curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
      curfewTimetablePage.form.saveAndContinueButton.click()
      curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
      if (takeScreenshots) cy.screenshot('17. curfewTimetablePage - validation', { overwrite: true })
      curfewTimetablePage.form.fillInWith(curfewTimetable)
      if (takeScreenshots) cy.screenshot('17. curfewTimetablePage - minimum', { overwrite: true })
      curfewTimetablePage.form.saveAndContinueButton.click()

      let enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
      enforcementZonePage.form.saveAndContinueButton.click()
      enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
      if (takeScreenshots) cy.screenshot('18. enforcementZonePage - validation', { overwrite: true })
      enforcementZonePage.form.fillInWith(primaryEnforcementZoneDetails)
      if (takeScreenshots) cy.screenshot('18. enforcementZonePage - minimum', { overwrite: true })
      enforcementZonePage.form.saveAndContinueButton.click()

      let trailMonitoringPage = Page.verifyOnPage(TrailMonitoringPage)
      trailMonitoringPage.form.saveAndContinueButton.click()
      trailMonitoringPage = Page.verifyOnPage(TrailMonitoringPage)
      if (takeScreenshots) cy.screenshot('20. trailMonitoringPage - validation', { overwrite: true })
      trailMonitoringPage.form.fillInWith(trailMonitoringOrder)
      if (takeScreenshots) cy.screenshot('20. trailMonitoringPage - minimum', { overwrite: true })
      trailMonitoringPage.form.saveAndContinueButton.click()

      // Disabled as alcohol monitoring can't currently be selected as a monitoring type.
      // let alcoholMonitoringPage = Page.verifyOnPage(AlcoholMonitoringPage)
      // alcoholMonitoringPage.form.saveAndContinueButton.click()
      // alcoholMonitoringPage = Page.verifyOnPage(AlcoholMonitoringPage)
      // if (takeScreenshots) cy.screenshot('21. alcoholMonitoringPage - validation', { overwrite: true })
      // alcoholMonitoringPage.form.fillInWith(alcoholMonitoringOrder)
      // if (takeScreenshots) cy.screenshot('21. alcoholMonitoringPage - minimum', { overwrite: true })
      // alcoholMonitoringPage.form.saveAndContinueButton.click()

      const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(
        MonitoringConditionsCheckYourAnswersPage,
        'Check your answer',
      )
      monitoringConditionsCheckYourAnswersPage.continueButton().click()

      const licencePage = Page.verifyOnPage(UploadLicencePage)
      licencePage.form.uploadField.uploadFile({ fileName: files.licence.fileName, contents: files.licence.contents })
      if (takeScreenshots) cy.screenshot('22. licencePage', { overwrite: true })
      licencePage.form.saveAndContinueButton.click()

      const havePhotoPage = Page.verifyOnPage(HavePhotoPage)
      if (takeScreenshots) cy.screenshot('23. havePhotoPage', { overwrite: true })
      havePhotoPage.form.havePhotoField.set('No')
      havePhotoPage.form.saveAndContinueButton.click()

      const attachmentPage = Page.verifyOnPage(AttachmentSummaryPage)
      if (takeScreenshots) cy.screenshot('24. attachmentPage', { overwrite: true })
      attachmentPage.saveAndReturnButton.click()

      orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      orderSummaryPage.submitOrderButton.click()

      const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
      if (takeScreenshots) cy.screenshot('25. submitSuccessPage', { overwrite: true })
      submitSuccessPage.backToYourApplications.click()

      indexPage = Page.verifyOnPage(IndexPage)
      if (takeScreenshots) cy.screenshot('26. indexPageAfterSubmission', { overwrite: true })
      indexPage.SubmittedOrderFor(deviceWearerDetails.fullName).should('exist')
    })
  })

  context('Fill in youth mandatory only fields and screenshot', () => {
    const fullDeviceWearerDetails = createFakeYouthDeviceWearer()
    const deviceWearerDetails = {
      firstNames: fullDeviceWearerDetails.firstNames,
      lastName: fullDeviceWearerDetails.lastName,
      fullName: fullDeviceWearerDetails.fullName,
      dob: fullDeviceWearerDetails.dob,
      is18: false,
      sex: fullDeviceWearerDetails.sex,
      genderIdentity: fullDeviceWearerDetails.genderIdentity,
      interpreterRequired: false,
      contactNumber: undefined,
      hasFixedAddress: 'Yes',
    }
    const identityNumbers = {
      nomisId: fullDeviceWearerDetails.nomisId,
      deliusId: fullDeviceWearerDetails.deliusId,
      pncId: fullDeviceWearerDetails.pncId,
      prisonNumber: fullDeviceWearerDetails.prisonNumber,
      homeOfficeReferenceNumber: fullDeviceWearerDetails.homeOfficeReferenceNumber,
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
      line2: undefined,
      line4: undefined,
      hasAnotherAddress: 'No',
    }
    const interestedParties = createFakeInterestedParties('Prison', 'Probation', null, 'North West')
    const probationDeliveryUnit = { unit: 'Blackburn' }
    const monitoringConditions = {
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 11), // 11 days
      orderType: 'Post Release',
      pilot: 'GPS Acquisitive Crime Parole',
      conditionType: 'Licence condition',
      sentenceType: 'Life Sentence',
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
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 20), // 20 days
      addresses: [/Main address/],
      curfewAdditionalDetails: '',
    }
    const curfewNights = ['FRIDAY', 'SATURDAY', 'SUNDAY']
    const curfewTimetable = curfewNights.flatMap((day: string) => [
      {
        day,
        startTime: '19:00:00',
        endTime: '07:00:00',
        addresses: curfewConditionDetails.addresses,
      },
    ])
    const primaryEnforcementZoneDetails = {
      zoneType: 'Exclusion zone',
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
      endDate: new Date(new Date().getTime() + 3000 * 60 * 60 * 24 * 10), // 30 days
      description: 'A test description: Lorum ipsum dolar sit amet...',
      duration: 'A test duration: one, two, three...',
      anotherZone: 'No',
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
      possibleRisk: 'Sex offender',
      riskCategory: 'Children under the age of 18 are living at the property',
      riskDetails: 'No risk',
    }

    it('Should successfully submit the order to the FMS API', () => {
      cy.signIn()

      let indexPage = Page.verifyOnPage(IndexPage)
      if (takeScreenshots) cy.screenshot('01. indexPage', { overwrite: true })
      indexPage.newOrderFormButton.click()

      let orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      if (takeScreenshots) cy.screenshot('02. orderSummaryPage - minimum', { overwrite: true })
      orderSummaryPage.aboutTheDeviceWearerTask.click()

      let aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
      aboutDeviceWearerPage.form.saveAndContinueButton.click()
      aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
      if (takeScreenshots) cy.screenshot('03. aboutDeviceWearerPage - validation', { overwrite: true })
      aboutDeviceWearerPage.form.fillInWith(deviceWearerDetails)
      if (takeScreenshots) cy.screenshot('03. aboutDeviceWearerPage - minimum', { overwrite: true })
      aboutDeviceWearerPage.form.saveAndContinueButton.click()

      let responsibleAdultDetailsPage = Page.verifyOnPage(ResponsibleAdultPage)
      responsibleAdultDetailsPage.form.saveAndContinueButton.click()
      responsibleAdultDetailsPage = Page.verifyOnPage(ResponsibleAdultPage)
      if (takeScreenshots) cy.screenshot('04. responsibleAdultDetailsPage - validation', { overwrite: true })
      responsibleAdultDetailsPage.form.fillInWith(responsibleAdultDetails)
      if (takeScreenshots) cy.screenshot('04. responsibleAdultDetailsPage - minimum', { overwrite: true })
      responsibleAdultDetailsPage.form.saveAndContinueButton.click()

      const identityNumbersPage = Page.verifyOnPage(IdentityNumbersPage)
      identityNumbersPage.form.fillInWith(identityNumbers)
      if (takeScreenshots) cy.screenshot('04. identityNumbersPage', { overwrite: true })
      identityNumbersPage.form.saveAndContinueButton.click()

      const deviceWearerCheckYourAnswersPage = Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')
      deviceWearerCheckYourAnswersPage.continueButton().click()

      let contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
      contactDetailsPage.form.fillInWith({ contactNumber: '0123456789' })
      contactDetailsPage.form.saveAndContinueButton.click()
      if (takeScreenshots) cy.screenshot('05. contactDetailsPage - validation', { overwrite: true })
      contactDetailsPage.form.fillInWith({ contactNumber: '{selectall}{del}' })
      contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
      if (takeScreenshots) cy.screenshot('05. contactDetailsPage', { overwrite: true })
      contactDetailsPage.form.saveAndContinueButton.click()

      let noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
      noFixedAbode.form.saveAndContinueButton.click()
      noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
      if (takeScreenshots) cy.screenshot('06. noFixedAbode - validation', { overwrite: true })
      noFixedAbode.form.fillInWith(deviceWearerDetails)
      if (takeScreenshots) cy.screenshot('06. noFixedAbode - minimum', { overwrite: true })
      noFixedAbode.form.saveAndContinueButton.click()

      let primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
      primaryAddressPage.form.saveAndContinueButton.click()
      primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
      if (takeScreenshots) cy.screenshot('07. primaryAddressPage - validation', { overwrite: true })
      primaryAddressPage.form.fillInWith(primaryAddressDetails)
      if (takeScreenshots) cy.screenshot('07. primaryAddressPage - minimum', { overwrite: true })
      primaryAddressPage.form.saveAndContinueButton.click()

      // no validation
      let interestedPartiesPage = Page.verifyOnPage(InterestedPartiesPage)
      // interestedPartiesPage.form.saveAndContinueButton.click()
      interestedPartiesPage = Page.verifyOnPage(InterestedPartiesPage)
      if (takeScreenshots) cy.screenshot('10. notifyingOrganisationPage - validation', { overwrite: true })
      interestedPartiesPage.form.fillInWith(interestedParties)
      if (takeScreenshots) cy.screenshot('10. notifyingOrganisationPage - minimum', { overwrite: true })
      interestedPartiesPage.form.saveAndContinueButton.click()

      const probationDeliveryUnitPage = Page.verifyOnPage(ProbationDeliveryUnitPage)
      probationDeliveryUnitPage.form.fillInWith(probationDeliveryUnit)
      probationDeliveryUnitPage.form.saveAndContinueButton.click()

      const contactInformationCheckYourAnswersPage = Page.verifyOnPage(
        ContactInformationCheckYourAnswersPage,
        'Check your answer',
      )
      contactInformationCheckYourAnswersPage.continueButton().click()

      // no validation
      let installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
      installationAndRiskPage.form.saveAndContinueButton.click()
      installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
      if (takeScreenshots) cy.screenshot('11. installationAndRiskPage - validation', { overwrite: true })
      installationAndRiskPage.form.fillInWith(installationAndRisk)
      if (takeScreenshots) cy.screenshot('11. installationAndRiskPage - minimum', { overwrite: true })
      installationAndRiskPage.form.saveAndContinueButton.click()

      const installationAndRiskCheckYourAnswersPage = Page.verifyOnPage(
        InstallationAndRiskCheckYourAnswersPage,
        'Check your answer',
      )
      if (takeScreenshots)
        cy.screenshot('11. installationAndRiskCheckYourAnswersPage - validation', { overwrite: true })
      // installationAndRiskPage.fillInWith()
      if (takeScreenshots) cy.screenshot('11. installationAndRiskCheckYourAnswersPage - minimum', { overwrite: true })
      installationAndRiskCheckYourAnswersPage.continueButton().click()

      let monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
      monitoringConditionsPage.form.saveAndContinueButton.click()
      monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
      if (takeScreenshots) cy.screenshot('12. monitoringConditionsPage - validation', { overwrite: true })
      monitoringConditionsPage.form.fillInWith(monitoringConditions)
      if (takeScreenshots) cy.screenshot('12. monitoringConditionsPage - minimum', { overwrite: true })
      monitoringConditionsPage.form.saveAndContinueButton.click()

      let curfewReleaseDatePage = Page.verifyOnPage(CurfewReleaseDatePage)
      curfewReleaseDatePage.form.saveAndContinueButton.click()
      curfewReleaseDatePage = Page.verifyOnPage(CurfewReleaseDatePage)
      if (takeScreenshots) cy.screenshot('14. curfewReleaseDatePage - validation', { overwrite: true })
      curfewReleaseDatePage.form.fillInWith(curfewReleaseDetails)
      if (takeScreenshots) cy.screenshot('14. curfewReleaseDatePage - minimum', { overwrite: true })
      curfewReleaseDatePage.form.saveAndContinueButton.click()

      let curfewConditionsPage = Page.verifyOnPage(CurfewConditionsPage)
      curfewConditionsPage.form.saveAndContinueButton.click()
      curfewConditionsPage = Page.verifyOnPage(CurfewConditionsPage)
      if (takeScreenshots) cy.screenshot('15. curfewConditionsPage - validation', { overwrite: true })
      curfewConditionsPage.form.fillInWith(curfewConditionDetails)
      if (takeScreenshots) cy.screenshot('15. curfewConditionsPage - minimum', { overwrite: true })
      curfewConditionsPage.form.saveAndContinueButton.click()

      let curfewAdditionalDetailsPage = Page.verifyOnPage(CurfewAdditionalDetailsPage)
      curfewAdditionalDetailsPage.form.saveAndContinueButton.click()
      curfewAdditionalDetailsPage = Page.verifyOnPage(CurfewAdditionalDetailsPage)
      if (takeScreenshots) cy.screenshot('16. curfewAdditionalDetailsPage - validation', { overwrite: true })
      curfewAdditionalDetailsPage.form.fillInWith(curfewConditionDetails)
      if (takeScreenshots) cy.screenshot('16. curfewAdditionalDetailsPage', { overwrite: true })
      curfewAdditionalDetailsPage.form.saveAndContinueButton.click()

      let curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
      curfewTimetablePage.form.saveAndContinueButton.click()
      curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
      if (takeScreenshots) cy.screenshot('17. curfewTimetablePage - validation', { overwrite: true })
      curfewTimetablePage.form.fillInWith(curfewTimetable)
      if (takeScreenshots) cy.screenshot('17. curfewTimetablePage - minimum', { overwrite: true })
      curfewTimetablePage.form.saveAndContinueButton.click()

      let enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
      enforcementZonePage.form.saveAndContinueButton.click()
      enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
      if (takeScreenshots) cy.screenshot('18. enforcementZonePage - validation', { overwrite: true })
      enforcementZonePage.form.fillInWith(primaryEnforcementZoneDetails)
      if (takeScreenshots) cy.screenshot('18. enforcementZonePage - minimum', { overwrite: true })
      enforcementZonePage.form.saveAndContinueButton.click()

      let trailMonitoringPage = Page.verifyOnPage(TrailMonitoringPage)
      trailMonitoringPage.form.saveAndContinueButton.click()
      trailMonitoringPage = Page.verifyOnPage(TrailMonitoringPage)
      if (takeScreenshots) cy.screenshot('20. trailMonitoringPage - validation', { overwrite: true })
      trailMonitoringPage.form.fillInWith(trailMonitoringOrder)
      if (takeScreenshots) cy.screenshot('20. trailMonitoringPage - minimum', { overwrite: true })
      trailMonitoringPage.form.saveAndContinueButton.click()

      // Disabled as alcohol monitoring can't currently be selected as a monitoring type.
      // let alcoholMonitoringPage = Page.verifyOnPage(AlcoholMonitoringPage)
      // alcoholMonitoringPage.form.saveAndContinueButton.click()
      // alcoholMonitoringPage = Page.verifyOnPage(AlcoholMonitoringPage)
      // if (takeScreenshots) cy.screenshot('21. alcoholMonitoringPage - validation', { overwrite: true })
      // alcoholMonitoringPage.form.fillInWith(alcoholMonitoringOrder)
      // if (takeScreenshots) cy.screenshot('21. alcoholMonitoringPage - minimum', { overwrite: true })
      // alcoholMonitoringPage.form.saveAndContinueButton.click()

      const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(
        MonitoringConditionsCheckYourAnswersPage,
        'Check your answer',
      )
      monitoringConditionsCheckYourAnswersPage.continueButton().click()

      const licencePage = Page.verifyOnPage(UploadLicencePage)
      licencePage.form.uploadField.uploadFile({ fileName: files.licence.fileName, contents: files.licence.contents })
      if (takeScreenshots) cy.screenshot('22. licencePage', { overwrite: true })
      licencePage.form.saveAndContinueButton.click()

      const havePhotoPage = Page.verifyOnPage(HavePhotoPage)
      if (takeScreenshots) cy.screenshot('23. havePhotoPage', { overwrite: true })
      havePhotoPage.form.havePhotoField.set('No')
      havePhotoPage.form.saveAndContinueButton.click()

      const attachmentPage = Page.verifyOnPage(AttachmentSummaryPage)
      if (takeScreenshots) cy.screenshot('24. attachmentPage', { overwrite: true })
      attachmentPage.saveAndReturnButton.click()

      orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      orderSummaryPage.submitOrderButton.click()

      const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
      if (takeScreenshots) cy.screenshot('25. submitSuccessPage', { overwrite: true })
      submitSuccessPage.backToYourApplications.click()

      indexPage = Page.verifyOnPage(IndexPage)
      if (takeScreenshots) cy.screenshot('26. indexPageAfterSubmission', { overwrite: true })
      indexPage.SubmittedOrderFor(deviceWearerDetails.fullName).should('exist')
    })
  })
})
