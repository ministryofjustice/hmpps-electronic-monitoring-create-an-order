import AppPage from '../appPage'
import Page, { PageElement } from '../page'
import paths from '../../../server/constants/paths'
import Task from '../components/task'
import AboutDeviceWearerPage from './about-the-device-wearer/device-wearer'
import ResponsibleAdultDetailsPage from './about-the-device-wearer/responsible-adult-details'
import ContactDetailsPage from './contact-information/contact-details'
import NoFixedAbodePage from './contact-information/no-fixed-abode'
import PrimaryAddressPage from './contact-information/primary-address'
import InterestedPartiesPage from './contact-information/interested-parties'
import MonitoringConditionsPage from './monitoring-conditions'
import InstallationAddressPage from './monitoring-conditions/installation-address'
import InstallationAndRiskPage from './installationAndRisk'
import CurfewTimetablePage from './monitoring-conditions/curfew-timetable'
import CurfewConditionsPage from './monitoring-conditions/curfew-conditions'
import CurfewReleaseDatePage from './monitoring-conditions/curfew-release-date'
import AttachmentSummaryPage from './attachments/summary'
import DeviceWearerCheckYourAnswersPage from './about-the-device-wearer/check-your-answers'
import MonitoringConditionsCheckYourAnswersPage from './monitoring-conditions/check-your-answers'
import ContactInformationCheckYourAnswersPage from './contact-information/check-your-answers'
import IdentityNumbersPage from './about-the-device-wearer/identity-numbers'
import UploadPhotoIdPage from './attachments/uploadPhotoId'
import VariationDetailsPage from './variation/variationDetails'
import EnforcementZonePage from './monitoring-conditions/enforcement-zone'
import AlcoholMonitoringPage from './monitoring-conditions/alcohol-monitoring'
import UploadLicencePage from './attachments/uploadLicence'

export default class OrderTasksPage extends AppPage {
  constructor() {
    super('Tag request form', paths.ORDER.SUMMARY, 'Form sections')
  }

  get variationDetailsTask(): Task {
    return new Task('Variation details')
  }

  get deviceWearerTask(): Task {
    return new Task('Device wearer')
  }

  get responsibleAdultTask(): Task {
    return new Task('Responsible adult')
  }

  get contactDetailsTask(): Task {
    return new Task('Contact details')
  }

  get noFixedAbodeTask(): Task {
    return new Task('No fixed abode')
  }

  get primaryAddressTask(): Task {
    return new Task('Primary address')
  }

  get secondaryAddressTask(): Task {
    return new Task('Secondary address')
  }

  get tertiaryAddressTask(): Task {
    return new Task('Tertiary address')
  }

  get interestedPartiesTask(): Task {
    return new Task('Interested parties')
  }

  get installationAndRiskTask(): Task {
    return new Task('Installation and risk')
  }

  get monitoringConditionsTask(): Task {
    return new Task('Monitoring conditions')
  }

  get installationAddressTask(): Task {
    return new Task('Installation address')
  }

  get curfewReleaseDateTask(): Task {
    return new Task('Curfew release date')
  }

  get curfewConditionsTask(): Task {
    return new Task('Curfew conditions')
  }

  get curfewTimetableTask(): Task {
    return new Task('Curfew timetable')
  }

  get zoneTask(): Task {
    return new Task('Enforcement zone monitoring')
  }

  get trailTask(): Task {
    return new Task('Trail monitoring')
  }

  get attendanceTask(): Task {
    return new Task('Attendance monitoring')
  }

  get alcoholTask(): Task {
    return new Task('Alcohol monitoring')
  }

  get attachmentsTask(): Task {
    return new Task('Attachments')
  }

  get submitOrderButton(): PageElement {
    return cy.contains('button', 'Submit order')
  }

  get backToSearchButton(): PageElement {
    return cy.contains('a', 'Back')
  }

  fillInNewCurfewOrderWith({
    deviceWearerDetails,
    responsibleAdultDetails,
    primaryAddressDetails,
    secondaryAddressDetails,
    interestedParties,
    monitoringConditions,
    installationAddressDetails,
    curfewReleaseDetails,
    curfewConditionDetails,
    curfewTimetable,
    files,
  }): OrderTasksPage {
    this.deviceWearerTask.click()

    this.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      responsibleAdultDetails,
      primaryAddressDetails,
      secondaryAddressDetails,
      interestedParties,
      monitoringConditions,
      installationAddressDetails,
    })

    this.fillInCurfewOrderDetailsWith({
      curfewReleaseDetails,
      curfewConditionDetails,
      curfewTimetable,
    })

    this.fillInAttachmentDetailsWith({
      files,
    })

    return Page.verifyOnPage(OrderTasksPage)
  }

  fillInCurfewVariationWith({
    variationDetails,
    deviceWearerDetails,
    responsibleAdultDetails,
    primaryAddressDetails,
    secondaryAddressDetails,
    interestedParties,
    monitoringConditions,
    installationAddressDetails,
    curfewReleaseDetails,
    curfewConditionDetails,
    curfewTimetable,
    files,
  }): OrderTasksPage {
    this.variationDetailsTask.click()

    const variationDetailsPage = Page.verifyOnPage(VariationDetailsPage)
    variationDetailsPage.form.fillInWith(variationDetails)
    variationDetailsPage.form.saveAndContinueButton.click()

    this.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      responsibleAdultDetails,
      primaryAddressDetails,
      secondaryAddressDetails,
      interestedParties,
      monitoringConditions,
      installationAddressDetails,
    })

    this.fillInCurfewOrderDetailsWith({
      curfewReleaseDetails,
      curfewConditionDetails,
      curfewTimetable,
    })

    this.fillInAttachmentDetailsWith({
      files,
    })

    return Page.verifyOnPage(OrderTasksPage)
  }

  fillInNewEnforcementZoneOrderWith({
    deviceWearerDetails,
    responsibleAdultDetails,
    primaryAddressDetails,
    secondaryAddressDetails,
    interestedParties,
    monitoringConditions,
    installationAddressDetails,
    enforcementZoneDetails,
    files,
  }): OrderTasksPage {
    this.deviceWearerTask.click()

    this.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      responsibleAdultDetails,
      primaryAddressDetails,
      secondaryAddressDetails,
      interestedParties,
      monitoringConditions,
      installationAddressDetails,
    })

    this.fillInEnforcementZoneOrderDetailsWith({
      enforcementZoneDetails,
    })

    this.fillInAttachmentDetailsWith({
      files,
    })

    return Page.verifyOnPage(OrderTasksPage)
  }

  fillInEnforcementZoneVariationWith({
    variationDetails,
    deviceWearerDetails,
    responsibleAdultDetails,
    primaryAddressDetails,
    secondaryAddressDetails,
    interestedParties,
    monitoringConditions,
    installationAddressDetails,
    enforcementZoneDetails,
    files,
  }): OrderTasksPage {
    this.variationDetailsTask.click()

    const variationDetailsPage = Page.verifyOnPage(VariationDetailsPage)
    variationDetailsPage.form.fillInWith(variationDetails)
    variationDetailsPage.form.saveAndContinueButton.click()

    this.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      responsibleAdultDetails,
      primaryAddressDetails,
      secondaryAddressDetails,
      interestedParties,
      monitoringConditions,
      installationAddressDetails,
    })

    this.fillInEnforcementZoneOrderDetailsWith({
      enforcementZoneDetails,
    })

    this.fillInAttachmentDetailsWith({
      files,
    })

    return Page.verifyOnPage(OrderTasksPage)
  }

  fillInNewAlcoholMonitoringOrderWith({
    deviceWearerDetails,
    responsibleAdultDetails,
    primaryAddressDetails,
    secondaryAddressDetails,
    interestedParties,
    monitoringConditions,
    installationAddressDetails,
    alcoholMonitoringDetails,
    files,
  }): OrderTasksPage {
    this.deviceWearerTask.click()

    this.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      responsibleAdultDetails,
      primaryAddressDetails,
      secondaryAddressDetails,
      interestedParties,
      monitoringConditions,
      installationAddressDetails,
    })

    this.fillInAlcoholMonitoringOrderDetailsWith({
      alcoholMonitoringDetails,
    })

    this.fillInAttachmentDetailsWith({
      files,
    })

    return Page.verifyOnPage(OrderTasksPage)
  }

  fillInAlcoholMonitoringVariationWith({
    variationDetails,
    deviceWearerDetails,
    responsibleAdultDetails,
    primaryAddressDetails,
    secondaryAddressDetails,
    interestedParties,
    monitoringConditions,
    installationAddressDetails,
    alcoholMonitoringDetails,
    files,
  }): OrderTasksPage {
    this.variationDetailsTask.click()

    const variationDetailsPage = Page.verifyOnPage(VariationDetailsPage)
    variationDetailsPage.form.fillInWith(variationDetails)
    variationDetailsPage.form.saveAndContinueButton.click()

    this.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      responsibleAdultDetails,
      primaryAddressDetails,
      secondaryAddressDetails,
      interestedParties,
      monitoringConditions,
      installationAddressDetails,
    })

    this.fillInAlcoholMonitoringOrderDetailsWith({
      alcoholMonitoringDetails,
    })

    this.fillInAttachmentDetailsWith({
      files,
    })

    return Page.verifyOnPage(OrderTasksPage)
  }

  fillInGeneralOrderDetailsWith({
    deviceWearerDetails,
    responsibleAdultDetails,
    primaryAddressDetails,
    secondaryAddressDetails,
    interestedParties,
    monitoringConditions,
    installationAddressDetails,
  }): void {
    const aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
    aboutDeviceWearerPage.form.fillInWith(deviceWearerDetails)
    aboutDeviceWearerPage.form.saveAndContinueButton.click()

    if (responsibleAdultDetails) {
      const responsibleAdultDetailsPage = Page.verifyOnPage(ResponsibleAdultDetailsPage)
      responsibleAdultDetailsPage.form.fillInWith(responsibleAdultDetails)
      responsibleAdultDetailsPage.form.saveAndContinueButton.click()
    }
    const identityNumbersPage = Page.verifyOnPage(IdentityNumbersPage)
    identityNumbersPage.form.fillInWith(deviceWearerDetails)
    identityNumbersPage.form.saveAndContinueButton.click()

    const deviceWearerCheckYourAnswersPage = Page.verifyOnPage(DeviceWearerCheckYourAnswersPage)
    deviceWearerCheckYourAnswersPage.continueButton().click()

    const contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
    contactDetailsPage.form.fillInWith(deviceWearerDetails)
    contactDetailsPage.form.saveAndContinueButton.click()

    const noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
    noFixedAbode.form.fillInWith(deviceWearerDetails)
    noFixedAbode.form.saveAndContinueButton.click()

    const primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
    primaryAddressPage.form.fillInWith({
      ...primaryAddressDetails,
      hasAnotherAddress: secondaryAddressDetails === undefined ? 'No' : 'Yes',
    })
    primaryAddressPage.form.saveAndContinueButton.click()

    if (secondaryAddressDetails !== undefined) {
      const secondaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
      secondaryAddressPage.form.fillInWith({
        ...secondaryAddressDetails,
        hasAnotherAddress: 'No',
      })
      secondaryAddressPage.form.saveAndContinueButton.click()
    }

    const interestedPartiesPage = Page.verifyOnPage(InterestedPartiesPage)
    interestedPartiesPage.form.fillInWith(interestedParties)
    interestedPartiesPage.form.saveAndContinueButton.click()

    const contactInformationCheckYourAnswersPage = Page.verifyOnPage(ContactInformationCheckYourAnswersPage)
    contactInformationCheckYourAnswersPage.continueButton().click()

    const installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
    installationAndRiskPage.saveAndContinueButton().click()

    const monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
    monitoringConditionsPage.form.fillInWith(monitoringConditions)
    monitoringConditionsPage.form.saveAndContinueButton.click()

    const installationAddress = Page.verifyOnPage(InstallationAddressPage)
    installationAddress.form.fillInWith(installationAddressDetails)
    installationAddress.form.saveAndContinueButton.click()
  }

  fillInCurfewOrderDetailsWith({ curfewReleaseDetails, curfewConditionDetails, curfewTimetable }): void {
    const curfewReleaseDatePage = Page.verifyOnPage(CurfewReleaseDatePage)
    curfewReleaseDatePage.form.fillInWith(curfewReleaseDetails)
    curfewReleaseDatePage.form.saveAndContinueButton.click()

    const curfewConditionsPage = Page.verifyOnPage(CurfewConditionsPage)
    curfewConditionsPage.form.fillInWith(curfewConditionDetails)
    curfewConditionsPage.form.saveAndContinueButton.click()

    const curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
    curfewTimetablePage.form.fillInWith(curfewTimetable)
    curfewTimetablePage.form.saveAndContinueButton.click()

    const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage)
    monitoringConditionsCheckYourAnswersPage.continueButton().click()
  }

  fillInEnforcementZoneOrderDetailsWith({ enforcementZoneDetails }) {
    const enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
    enforcementZonePage.form.fillInWith(enforcementZoneDetails)
    enforcementZonePage.form.saveAndContinueButton.click()

    const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage)
    monitoringConditionsCheckYourAnswersPage.continueButton().click()
  }

  fillInAlcoholMonitoringOrderDetailsWith({ alcoholMonitoringDetails }): void {
    const alcoholMonitoringPage = Page.verifyOnPage(AlcoholMonitoringPage)
    alcoholMonitoringPage.form.fillInWith(alcoholMonitoringDetails)
    alcoholMonitoringPage.form.saveAndContinueButton.click()

    const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage)
    monitoringConditionsCheckYourAnswersPage.continueButton().click()
  }

  fillInAttachmentDetailsWith({ files }): void {
    let attachmentPage = Page.verifyOnPage(AttachmentSummaryPage)

    if (files && files.photoId !== undefined) {
      attachmentPage.photoIdTask.addAction.click()
      const uploadPhotoIdPage = Page.verifyOnPage(UploadPhotoIdPage)
      uploadPhotoIdPage.form.fillInWith({
        file: files.photoId,
      })
      uploadPhotoIdPage.form.saveAndContinueButton.click()
      attachmentPage = Page.verifyOnPage(AttachmentSummaryPage)
    }

    if (files && files.licence !== undefined) {
      attachmentPage.licenceTask.addAction.click()
      const uploadLicencePage = Page.verifyOnPage(UploadLicencePage)
      uploadLicencePage.form.fillInWith({
        file: files.licence,
      })
      uploadLicencePage.form.saveAndContinueButton.click()
      attachmentPage = Page.verifyOnPage(AttachmentSummaryPage)
    }

    attachmentPage.backToSummaryButton.click()
  }
}
