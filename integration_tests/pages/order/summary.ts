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
import InstallationAndRiskCheckYourAnswersPage from './installation-and-risk/check-your-answers'
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
import TrailMonitoringPage from './monitoring-conditions/trail-monitoring'
import SecondaryAddressPage from './contact-information/secondary-address'
import ProbationDeliveryUnitPage from './contact-information/probation-delivery-unit'
import CurfewAdditionalDetailsPage from './monitoring-conditions/curfew-additional-details'
import InstallationLocationPage from './monitoring-conditions/installation-location'

export default class OrderTasksPage extends AppPage {
  constructor() {
    super('Electronic Monitoring application form', paths.ORDER.SUMMARY, '')
  }

  get variationDetailsTask(): Task {
    return new Task('About the changes in this version of the form')
  }

  get aboutTheDeviceWearerTask(): Task {
    return new Task('About the device wearer')
  }

  get contactInformationTask(): Task {
    return new Task('Contact information')
  }

  get riskInformationTask(): Task {
    return new Task('Risk information')
  }

  get electronicMonitoringTask(): Task {
    return new Task('Electronic monitoring conditions')
  }

  get additionalDocumentsTask(): Task {
    return new Task('Additional documents')
  }

  get submitOrderButton(): PageElement {
    return cy.contains('button', 'Submit form')
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
    installationAndRisk,
    monitoringConditions,
    installationAddressDetails,
    curfewReleaseDetails,
    curfewConditionDetails,
    curfewTimetable,
    files,
    probationDeliveryUnit,
  }): OrderTasksPage {
    this.aboutTheDeviceWearerTask.click()

    this.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      responsibleAdultDetails,
      primaryAddressDetails,
      secondaryAddressDetails,
      interestedParties,
      installationAndRisk,
      monitoringConditions,
      installationAddressDetails,
      probationDeliveryUnit,
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

  fillInNewOrderWith({
    deviceWearerDetails,
    responsibleAdultDetails,
    primaryAddressDetails,
    secondaryAddressDetails,
    interestedParties,
    installationAndRisk,
    monitoringConditions,
    installationAddressDetails,
    curfewReleaseDetails,
    curfewConditionDetails,
    curfewTimetable,
    enforcementZoneDetails,
    alcoholMonitoringDetails,
    trailMonitoringDetails,
    files,
    probationDeliveryUnit,
  }): OrderTasksPage {
    this.aboutTheDeviceWearerTask.click()

    this.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      responsibleAdultDetails,
      primaryAddressDetails,
      secondaryAddressDetails,
      interestedParties,
      installationAndRisk,
      monitoringConditions,
      installationAddressDetails,
      probationDeliveryUnit,
    })

    if (curfewReleaseDetails) {
      this.fillInCurfewOrderDetailsWith(
        {
          curfewReleaseDetails,
          curfewConditionDetails,
          curfewTimetable,
        },
        false,
      )
    }

    if (enforcementZoneDetails) {
      this.fillInEnforcementZoneOrderDetailsWith(
        {
          enforcementZoneDetails,
        },
        false,
      )
    }

    if (trailMonitoringDetails) {
      this.fillInTrailMonitoringOrderDetailsWith(
        {
          trailMonitoringDetails,
        },
        false,
      )
    }

    if (alcoholMonitoringDetails) {
      this.fillInAlcoholMonitoringOrderDetailsWith(
        {
          alcoholMonitoringDetails,
        },
        false,
      )
    }

    const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(
      MonitoringConditionsCheckYourAnswersPage,
      'Check your answer',
    )
    monitoringConditionsCheckYourAnswersPage.continueButton().click()

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
    installationAndRisk,
    monitoringConditions,
    installationAddressDetails,
    curfewReleaseDetails,
    curfewConditionDetails,
    curfewTimetable,
    files,
    probationDeliveryUnit,
  }): OrderTasksPage {
    this.fillInVariationsDetails({ variationDetails })

    this.aboutTheDeviceWearerTask.click()

    this.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      responsibleAdultDetails,
      primaryAddressDetails,
      secondaryAddressDetails,
      interestedParties,
      installationAndRisk,
      monitoringConditions,
      installationAddressDetails,
      probationDeliveryUnit,
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
    installationAndRisk,
    monitoringConditions,
    installationAddressDetails,
    enforcementZoneDetails,
    files,
    probationDeliveryUnit,
  }): OrderTasksPage {
    this.aboutTheDeviceWearerTask.click()

    this.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      responsibleAdultDetails,
      primaryAddressDetails,
      secondaryAddressDetails,
      interestedParties,
      installationAndRisk,
      monitoringConditions,
      installationAddressDetails,
      probationDeliveryUnit,
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
    installationAndRisk,
    monitoringConditions,
    installationAddressDetails,
    enforcementZoneDetails,
    files,
    probationDeliveryUnit,
  }): OrderTasksPage {
    this.fillInVariationsDetails({ variationDetails })

    this.aboutTheDeviceWearerTask.click()

    this.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      responsibleAdultDetails,
      primaryAddressDetails,
      secondaryAddressDetails,
      interestedParties,
      installationAndRisk,
      monitoringConditions,
      installationAddressDetails,
      probationDeliveryUnit,
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
    installationAndRisk,
    monitoringConditions,
    installationAddressDetails,
    alcoholMonitoringDetails,
    files,
    probationDeliveryUnit,
  }): OrderTasksPage {
    this.aboutTheDeviceWearerTask.click()

    this.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      responsibleAdultDetails,
      primaryAddressDetails,
      secondaryAddressDetails,
      interestedParties,
      installationAndRisk,
      monitoringConditions,
      installationAddressDetails,
      probationDeliveryUnit,
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
    installationAndRisk,
    monitoringConditions,
    installationAddressDetails,
    alcoholMonitoringDetails,
    files,
    probationDeliveryUnit,
  }): OrderTasksPage {
    this.fillInVariationsDetails({ variationDetails })

    this.aboutTheDeviceWearerTask.click()

    this.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      responsibleAdultDetails,
      primaryAddressDetails,
      secondaryAddressDetails,
      interestedParties,
      installationAndRisk,
      monitoringConditions,
      installationAddressDetails,
      probationDeliveryUnit,
    })

    this.fillInAlcoholMonitoringOrderDetailsWith({
      alcoholMonitoringDetails,
    })

    this.fillInAttachmentDetailsWith({
      files,
    })

    return Page.verifyOnPage(OrderTasksPage)
  }

  fillInNewTrailMonitoringOrderWith({
    deviceWearerDetails,
    responsibleAdultDetails,
    primaryAddressDetails,
    secondaryAddressDetails,
    interestedParties,
    installationAndRisk,
    monitoringConditions,
    installationAddressDetails,
    trailMonitoringDetails,
    files,
    probationDeliveryUnit,
  }): OrderTasksPage {
    this.aboutTheDeviceWearerTask.click()

    this.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      responsibleAdultDetails,
      primaryAddressDetails,
      secondaryAddressDetails,
      interestedParties,
      installationAndRisk,
      monitoringConditions,
      installationAddressDetails,
      probationDeliveryUnit,
    })

    this.fillInTrailMonitoringOrderDetailsWith({
      trailMonitoringDetails,
    })

    this.fillInAttachmentDetailsWith({
      files,
    })

    return Page.verifyOnPage(OrderTasksPage)
  }

  fillInVariationsDetails({ variationDetails }): void {
    this.variationDetailsTask.click()
    const variationDetailsPage = Page.verifyOnPage(VariationDetailsPage)
    variationDetailsPage.form.fillInWith(variationDetails)
    variationDetailsPage.form.saveAndReturnButton.click()
    Page.verifyOnPage(OrderTasksPage)
  }

  fillInGeneralOrderDetailsWith({
    deviceWearerDetails,
    responsibleAdultDetails,
    primaryAddressDetails,
    secondaryAddressDetails,
    interestedParties,
    installationAndRisk,
    monitoringConditions,
    installationAddressDetails,
    probationDeliveryUnit,
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

    const deviceWearerCheckYourAnswersPage = Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')
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
      const secondaryAddressPage = Page.verifyOnPage(SecondaryAddressPage)
      secondaryAddressPage.form.fillInWith({
        ...secondaryAddressDetails,
        hasAnotherAddress: 'No',
      })
      secondaryAddressPage.form.saveAndContinueButton.click()
    }

    const interestedPartiesPage = Page.verifyOnPage(InterestedPartiesPage)
    interestedPartiesPage.form.fillInWith(interestedParties)
    interestedPartiesPage.form.saveAndContinueButton.click()

    if (interestedParties.responsibleOrganisation === 'Probation' && probationDeliveryUnit !== undefined) {
      const probationDeliveryUnitPage = Page.verifyOnPage(ProbationDeliveryUnitPage)
      probationDeliveryUnitPage.form.fillInWith(probationDeliveryUnit)
      probationDeliveryUnitPage.form.saveAndContinueButton.click()
    }
    const contactInformationCheckYourAnswersPage = Page.verifyOnPage(
      ContactInformationCheckYourAnswersPage,
      'Check your answer',
    )
    contactInformationCheckYourAnswersPage.continueButton().click()

    const installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
    installationAndRiskPage.form.fillInWith(installationAndRisk)
    installationAndRiskPage.form.saveAndContinueButton.click()

    const installationAndRiskCheckYourAnswersPage = Page.verifyOnPage(
      InstallationAndRiskCheckYourAnswersPage,
      'Check your answer',
    )
    installationAndRiskCheckYourAnswersPage.continueButton().click()

    const monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
    monitoringConditionsPage.form.fillInWith(monitoringConditions)
    monitoringConditionsPage.form.saveAndContinueButton.click()

    if (monitoringConditions.monitoringRequired !== 'Curfew') {
      const installationLocationPage = Page.verifyOnPage(InstallationLocationPage)
      installationLocationPage.form.fillInWith({ location: 'At another address' })
      installationLocationPage.form.saveAndContinueButton.click()

      const installationAddress = Page.verifyOnPage(InstallationAddressPage)
      installationAddress.form.fillInWith(installationAddressDetails)
      installationAddress.form.saveAndContinueButton.click()
    }
  }

  fillInCurfewOrderDetailsWith(
    { curfewReleaseDetails, curfewConditionDetails, curfewTimetable },
    checkYourAnswerPage = true,
  ): void {
    const curfewReleaseDatePage = Page.verifyOnPage(CurfewReleaseDatePage)
    curfewReleaseDatePage.form.fillInWith(curfewReleaseDetails)
    curfewReleaseDatePage.form.saveAndContinueButton.click()

    const curfewConditionsPage = Page.verifyOnPage(CurfewConditionsPage)
    curfewConditionsPage.form.fillInWith(curfewConditionDetails)
    curfewConditionsPage.form.saveAndContinueButton.click()

    const curfewAdditionalDetailsPage = Page.verifyOnPage(CurfewAdditionalDetailsPage)
    curfewAdditionalDetailsPage.form.fillInWith(curfewConditionDetails)
    curfewAdditionalDetailsPage.form.saveAndContinueButton.click()

    const curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
    curfewTimetablePage.form.fillInWith(curfewTimetable)
    curfewTimetablePage.form.saveAndContinueButton.click()

    if (checkYourAnswerPage) {
      const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(
        MonitoringConditionsCheckYourAnswersPage,
        'Check your answer',
      )
      monitoringConditionsCheckYourAnswersPage.continueButton().click()
    }
  }

  fillInEnforcementZoneOrderDetailsWith({ enforcementZoneDetails }, checkYourAnswerPage = true) {
    const enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
    enforcementZonePage.form.fillInWith(enforcementZoneDetails)
    enforcementZonePage.form.saveAndContinueButton.click()

    if (checkYourAnswerPage) {
      const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(
        MonitoringConditionsCheckYourAnswersPage,
        'Check your answer',
      )
      monitoringConditionsCheckYourAnswersPage.continueButton().click()
    }
  }

  fillInAlcoholMonitoringOrderDetailsWith({ alcoholMonitoringDetails }, checkYourAnswerPage = true): void {
    const alcoholMonitoringPage = Page.verifyOnPage(AlcoholMonitoringPage)
    alcoholMonitoringPage.form.fillInWith(alcoholMonitoringDetails)
    alcoholMonitoringPage.form.saveAndContinueButton.click()

    if (checkYourAnswerPage) {
      const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(
        MonitoringConditionsCheckYourAnswersPage,
        'Check your answer',
      )
      monitoringConditionsCheckYourAnswersPage.continueButton().click()
    }
  }

  fillInTrailMonitoringOrderDetailsWith({ trailMonitoringDetails }, checkYourAnswerPage = true): void {
    const trailMonitoringPage = Page.verifyOnPage(TrailMonitoringPage)
    trailMonitoringPage.form.fillInWith(trailMonitoringDetails)
    trailMonitoringPage.form.saveAndContinueButton.click()

    if (checkYourAnswerPage) {
      const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(
        MonitoringConditionsCheckYourAnswersPage,
        'Check your answer',
      )
      monitoringConditionsCheckYourAnswersPage.continueButton().click()
    }
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
