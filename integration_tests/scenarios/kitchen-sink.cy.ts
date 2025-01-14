import { v4 as uuidv4 } from 'uuid'
import config from '../support/config'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, createFakeAddress } from '../mockApis/faker'

import Page from '../pages/page'
import IndexPage from '../pages/index'
import OrderSummaryPage from '../pages/order/summary'
import AboutDeviceWearerPage from '../pages/order/about-the-device-wearer/device-wearer'
import ContactDetailsPage from '../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../pages/order/contact-information/no-fixed-abode'
import PrimaryAddressPage from '../pages/order/contact-information/primary-address'
import SecondaryAddressPage from '../pages/order/contact-information/secondary-address'
import TertiaryAddressPage from '../pages/order/contact-information/tertiary-adddress'
import InterestedPartiesPage from '../pages/order/contact-information/interested-parties'
import MonitoringConditionsPage from '../pages/order/monitoring-conditions'
import AlcoholMonitoringPage from '../pages/order/monitoring-conditions/alcohol-monitoring'
import SubmitSuccessPage from '../pages/order/submit-success'
import InstallationAddressPage from '../pages/order/monitoring-conditions/installation-address'
import CurfewReleaseDatePage from '../pages/order/monitoring-conditions/curfew-release-date'
import CurfewTimetablePage from '../pages/order/monitoring-conditions/curfew-timetable'
import InstallationAndRiskPage from '../pages/order/installationAndRisk'
import CurfewConditionsPage from '../pages/order/monitoring-conditions/curfew-conditions'
import EnforcementZonePage from '../pages/order/monitoring-conditions/enforcement-zone'
import TrailMonitoringPage from '../pages/order/monitoring-conditions/trail-monitoring'
import AttachmentSummaryPage from '../pages/order/attachments/summary'
import DeviceWearerCheckYourAnswersPage from '../pages/order/about-the-device-wearer/check-your-answers'
import MonitoringConditionsCheckYourAnswersPage from '../pages/order/monitoring-conditions/check-your-answers'
import ContactInformationCheckYourAnswersPage from '../pages/order/contact-information/check-your-answers'
import IdentityNumbersPage from '../pages/order/about-the-device-wearer/identity-numbers'

context('The kitchen sink', () => {
  const takeScreenshots = config.screenshots_enabled
  const fmsCaseId: string = uuidv4()
  const hmppsDocumentId: string = uuidv4()
  const uploadFile = {
    contents: 'I am a map of London football grounds',
    fileName: 'london-football-grounds.pdf',
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

    cy.task('stubUploadDocument', {
      id: '(.*)',
      httpStatus: 200,
      response: {
        documentUuid: hmppsDocumentId,
        documentFilename: uploadFile.fileName,
        filename: uploadFile.fileName,
        fileExtension: uploadFile.fileName.split('.')[1],
        mimeType: 'application/pdf',
      },
    })
  })

  context('Fill in everything "including the kitchen sink" and screenshot', () => {
    const deviceWearerDetails = {
      ...createFakeAdultDeviceWearer(),
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
    const installationAddressDetails = createFakeAddress()
    const interestedParties = createFakeInterestedParties()
    const monitoringConditions = {
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 40), // 40 days
      isPartOfACP: 'No',
      isPartOfDAPOL: 'No',
      orderType: 'Post Release',
      orderTypeDescription: 'DAPOL HDC',
      conditionType: 'Bail Order',
      monitoringRequired: [
        'Curfew with electronic monitoring',
        'Exclusion and inclusion zone monitoring',
        'Trail monitoring',
        // 'Mandatory attendance monitoring',
        'Alcohol monitoring',
      ],
    }
    const curfewReleaseDetails = {
      releaseDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day
      startTime: '19:00:00',
      endTime: '07:00:00',
      address: 'Primary address',
    }
    const curfewConditionDetails = {
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 15), // 15 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 35), // 35 days
      addresses: ['Primary address', 'Secondary address', 'Tertiary address'],
    }
    const curfewNights = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    const curfewTimetable = curfewNights.flatMap((day: string) => [
      {
        day,
        startTime: '00:00:00',
        endTime: curfewReleaseDetails.endTime,
        addresses: curfewConditionDetails.addresses,
      },
      {
        day,
        startTime: curfewReleaseDetails.startTime,
        endTime: '11:59:00',
        addresses: curfewConditionDetails.addresses,
      },
    ])
    const primaryEnforcementZoneDetails = {
      zoneType: 'Exclusion zone',
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 100), // 100 days
      uploadFile,
      description: 'A test description: Lorum ipsum dolar sit amet...',
      duration: 'A test duration: one, two, three...',
      anotherZone: 'Yes',
    }
    const secondEnforcementZoneDetails = {
      zoneType: 'Inclusion zone',
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 100), // 100 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 200), // 200 days
      uploadFile,
      description: 'A second test description: Lorum ipsum dolar sit amet...',
      duration: 'A second test duration: one, two, three...',
      anotherZone: 'No',
    }
    const alcoholMonitoringOrder = {
      startDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)), // 15 days
      endDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 35).setHours(0, 0, 0, 0)), // 35 days
      monitoringType: 'Alcohol abstinence',
      installLocation: `at Installation Address: ${installationAddressDetails}`,
    }
    const trailMonitoringOrder = {
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 15), // 15 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 35), // 35 days
    }

    it('Should successfully submit the order to the FMS API', () => {
      cy.signIn()

      let indexPage = Page.verifyOnPage(IndexPage)
      if (takeScreenshots) cy.screenshot('01. indexPage', { overwrite: true })
      indexPage.newOrderFormButton.click()

      let orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      if (takeScreenshots) cy.screenshot('02. orderSummaryPage', { overwrite: true })
      orderSummaryPage.deviceWearerTask.click()

      let aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
      aboutDeviceWearerPage.form.saveAndContinueButton.click()
      aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
      if (takeScreenshots) cy.screenshot('03. aboutDeviceWearerPage - validation', { overwrite: true })
      aboutDeviceWearerPage.form.fillInWith(deviceWearerDetails)
      if (takeScreenshots) cy.screenshot('03. aboutDeviceWearerPage', { overwrite: true })
      aboutDeviceWearerPage.form.saveAndContinueButton.click()

      const identityNumbersPage = Page.verifyOnPage(IdentityNumbersPage)
      identityNumbersPage.form.fillInWith(deviceWearerDetails)
      if (takeScreenshots) cy.screenshot('04. identityNumbersPage', { overwrite: true })
      identityNumbersPage.form.saveAndContinueButton.click()

      const deviceWearerCheckYourAnswersPage = Page.verifyOnPage(DeviceWearerCheckYourAnswersPage)
      deviceWearerCheckYourAnswersPage.continueButton().click()

      let contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
      contactDetailsPage.form.fillInWith({ contactNumber: '0123456789' })
      contactDetailsPage.form.saveAndContinueButton.click()
      contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
      if (takeScreenshots) cy.screenshot('05. contactDetailsPage - validation', { overwrite: true })
      contactDetailsPage.form.fillInWith({ contactNumber: '{selectall}{del}' })
      contactDetailsPage.form.fillInWith(deviceWearerDetails)
      if (takeScreenshots) cy.screenshot('05. contactDetailsPage', { overwrite: true })
      contactDetailsPage.form.saveAndContinueButton.click()

      let noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
      noFixedAbode.form.saveAndContinueButton.click()
      noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
      if (takeScreenshots) cy.screenshot('06. noFixedAbode - validation', { overwrite: true })
      noFixedAbode.form.fillInWith(deviceWearerDetails)
      if (takeScreenshots) cy.screenshot('06. noFixedAbode', { overwrite: true })
      noFixedAbode.form.saveAndContinueButton.click()

      let primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
      primaryAddressPage.form.saveAndContinueButton.click()
      primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
      if (takeScreenshots) cy.screenshot('07. primaryAddressPage - validation', { overwrite: true })
      primaryAddressPage.form.fillInWith(primaryAddressDetails)
      if (takeScreenshots) cy.screenshot('07. primaryAddressPage', { overwrite: true })
      primaryAddressPage.form.saveAndContinueButton.click()

      let secondaryAddressPage = Page.verifyOnPage(SecondaryAddressPage)
      secondaryAddressPage.form.saveAndContinueButton.click()
      secondaryAddressPage = Page.verifyOnPage(SecondaryAddressPage)
      if (takeScreenshots) cy.screenshot('08. secondaryAddressPage - validation', { overwrite: true })
      secondaryAddressPage.form.fillInWith(secondaryAddressDetails)
      if (takeScreenshots) cy.screenshot('08. secondaryAddressPage', { overwrite: true })
      secondaryAddressPage.form.saveAndContinueButton.click()

      let tertiaryAddressPage = Page.verifyOnPage(TertiaryAddressPage)
      tertiaryAddressPage.form.saveAndContinueButton.click()
      tertiaryAddressPage = Page.verifyOnPage(TertiaryAddressPage)
      if (takeScreenshots) cy.screenshot('09. tertiaryAddressPage - validation', { overwrite: true })
      tertiaryAddressPage.form.fillInWith(tertiaryAddressDetails)
      if (takeScreenshots) cy.screenshot('09. tertiaryAddressPage', { overwrite: true })
      tertiaryAddressPage.form.saveAndContinueButton.click()

      // no validation
      let interestedPartiesPage = Page.verifyOnPage(InterestedPartiesPage)
      // interestedPartiesPage.form.saveAndContinueButton.click()
      interestedPartiesPage = Page.verifyOnPage(InterestedPartiesPage)
      if (takeScreenshots) cy.screenshot('10. interestedPartiesPage - validation', { overwrite: true })
      interestedPartiesPage.form.fillInWith(interestedParties)
      if (takeScreenshots) cy.screenshot('10. interestedPartiesPage', { overwrite: true })
      interestedPartiesPage.form.saveAndContinueButton.click()

      const contactInformationCheckYourAnswersPage = Page.verifyOnPage(ContactInformationCheckYourAnswersPage)
      contactInformationCheckYourAnswersPage.continueButton().click()

      // no validation
      let installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
      // installationAndRiskPage.saveAndContinueButton().click()
      installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
      if (takeScreenshots) cy.screenshot('11. installationAndRiskPage - validation', { overwrite: true })
      // installationAndRiskPage.fillInWith()
      if (takeScreenshots) cy.screenshot('11. installationAndRiskPage', { overwrite: true })
      installationAndRiskPage.saveAndContinueButton().click()

      let monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
      monitoringConditionsPage.form.saveAndContinueButton.click()
      monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
      if (takeScreenshots) cy.screenshot('12. monitoringConditionsPage - validation', { overwrite: true })
      monitoringConditionsPage.form.fillInWith(monitoringConditions)
      if (takeScreenshots) cy.screenshot('12. monitoringConditionsPage', { overwrite: true })
      monitoringConditionsPage.form.saveAndContinueButton.click()

      let installationAddressPage = Page.verifyOnPage(InstallationAddressPage)
      installationAddressPage.form.saveAndContinueButton.click()
      installationAddressPage = Page.verifyOnPage(InstallationAddressPage)
      if (takeScreenshots) cy.screenshot('13. installationAddressPage - validation', { overwrite: true })
      installationAddressPage.form.fillInWith(installationAddressDetails)
      if (takeScreenshots) cy.screenshot('13. installationAddressPage', { overwrite: true })
      installationAddressPage.form.saveAndContinueButton.click()

      let curfewReleaseDatePage = Page.verifyOnPage(CurfewReleaseDatePage)
      curfewReleaseDatePage.form.saveAndContinueButton.click()
      curfewReleaseDatePage = Page.verifyOnPage(CurfewReleaseDatePage)
      if (takeScreenshots) cy.screenshot('14. curfewReleaseDatePage - validation', { overwrite: true })
      curfewReleaseDatePage.form.fillInWith(curfewReleaseDetails)
      if (takeScreenshots) cy.screenshot('14. curfewReleaseDatePage', { overwrite: true })
      curfewReleaseDatePage.form.saveAndContinueButton.click()

      let curfewConditionsPage = Page.verifyOnPage(CurfewConditionsPage)
      curfewConditionsPage.form.saveAndContinueButton.click()
      curfewConditionsPage = Page.verifyOnPage(CurfewConditionsPage)
      if (takeScreenshots) cy.screenshot('15. curfewConditionsPage - validation', { overwrite: true })
      curfewConditionsPage.form.fillInWith(curfewConditionDetails)
      if (takeScreenshots) cy.screenshot('15. curfewConditionsPage', { overwrite: true })
      curfewConditionsPage.form.saveAndContinueButton.click()

      let curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
      curfewTimetablePage.form.saveAndContinueButton.click()
      curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
      if (takeScreenshots) cy.screenshot('16. curfewTimetablePage - validation', { overwrite: true })
      curfewTimetablePage.form.fillInWith(curfewTimetable)
      if (takeScreenshots) cy.screenshot('16. curfewTimetablePage', { overwrite: true })
      curfewTimetablePage.form.saveAndContinueButton.click()

      let enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
      enforcementZonePage.form.saveAndContinueButton.click()
      enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
      if (takeScreenshots) cy.screenshot('17. enforcementZonePage - validation', { overwrite: true })
      enforcementZonePage.form.fillInWith(primaryEnforcementZoneDetails)
      if (takeScreenshots) cy.screenshot('17. enforcementZonePage', { overwrite: true })
      enforcementZonePage.form.saveAndContinueButton.click()

      enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
      enforcementZonePage.form.saveAndContinueButton.click()
      enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
      if (takeScreenshots) cy.screenshot('18. enforcementZonePage - validation', { overwrite: true })
      enforcementZonePage.form.fillInWith(secondEnforcementZoneDetails)
      if (takeScreenshots) cy.screenshot('18. enforcementZonePage', { overwrite: true })
      enforcementZonePage.form.saveAndContinueButton.click()

      let trailMonitoringPage = Page.verifyOnPage(TrailMonitoringPage)
      trailMonitoringPage.form.saveAndContinueButton.click()
      trailMonitoringPage = Page.verifyOnPage(TrailMonitoringPage)
      if (takeScreenshots) cy.screenshot('19. trailMonitoringPage - validation', { overwrite: true })
      trailMonitoringPage.form.fillInWith(trailMonitoringOrder)
      if (takeScreenshots) cy.screenshot('19. trailMonitoringPage', { overwrite: true })
      trailMonitoringPage.form.saveAndContinueButton.click()

      let alcoholMonitoringPage = Page.verifyOnPage(AlcoholMonitoringPage)
      alcoholMonitoringPage.form.saveAndContinueButton.click()
      alcoholMonitoringPage = Page.verifyOnPage(AlcoholMonitoringPage)
      if (takeScreenshots) cy.screenshot('20. alcoholMonitoringPage - validation', { overwrite: true })
      alcoholMonitoringPage.form.fillInWith(alcoholMonitoringOrder)
      if (takeScreenshots) cy.screenshot('20. alcoholMonitoringPage', { overwrite: true })
      alcoholMonitoringPage.form.saveAndContinueButton.click()

      const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage)
      monitoringConditionsCheckYourAnswersPage.continueButton().click()

      const attachmentPage = Page.verifyOnPage(AttachmentSummaryPage)
      if (takeScreenshots) cy.screenshot('21. attachmentPage', { overwrite: true })
      attachmentPage.saveAndReturnButton.click()

      orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      orderSummaryPage.submitOrderButton.click()

      const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
      if (takeScreenshots) cy.screenshot('22. submitSuccessPage', { overwrite: true })
      submitSuccessPage.backToYourApplications.click()

      indexPage = Page.verifyOnPage(IndexPage)
      if (takeScreenshots) cy.screenshot('23. indexPageAfterSubmission', { overwrite: true })
      indexPage.SubmittedOrderFor(deviceWearerDetails.fullName).should('exist')
    })
  })
})
