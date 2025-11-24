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
import InstallationAndRiskPage from './installationAndRisk'
import InstallationAndRiskCheckYourAnswersPage from './installation-and-risk/check-your-answers'
import AttachmentSummaryPage from './attachments/summary'
import DeviceWearerCheckYourAnswersPage from './about-the-device-wearer/check-your-answers'
import MonitoringConditionsCheckYourAnswersPage from './monitoring-conditions/check-your-answers'
import ContactInformationCheckYourAnswersPage from './contact-information/check-your-answers'
import IdentityNumbersPage from './about-the-device-wearer/identity-numbers'
import UploadPhotoIdPage from './attachments/uploadPhotoId'
import VariationDetailsPage from './variation/variationDetails'
import UploadLicencePage from './attachments/uploadLicence'
import SecondaryAddressPage from './contact-information/secondary-address'
import ProbationDeliveryUnitPage from './contact-information/probation-delivery-unit'
import HavePhotoPage from './attachments/havePhoto'
import TertiaryAddressPage from './contact-information/tertiary-adddress'
import fillInOrderTypeDescriptionsWith from '../../utils/scenario-flows/orderTypeDescription'
import fillInTagAtSourceWith from '../../utils/scenario-flows/tag-at-source.cy'
import fillInCurfewOrderDetailsWith from '../../utils/scenario-flows/curfew.cy'
import fillInEnforcementZoneOrderDetailsWith from '../../utils/scenario-flows/enforcement-zone.cy'
import fillInAlcoholMonitoringOrderDetailsWith from '../../utils/scenario-flows/alcohol-monitoring.cy'
import fillInTrailMonitoringOrderDetailsWith from '../../utils/scenario-flows/trail-monitoring.cy'
import fillInAttendanceMonitoringDetailsWith from '../../utils/scenario-flows/attendance-monitoring.cy'

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

  get makeChangesButton(): PageElement {
    return cy.get('#make-changes-button')
  }

  get viewAndDownloadButton(): PageElement {
    return cy.get('#view-and-download-button')
  }

  fillInNewCurfewOrderWith({
    deviceWearerDetails,
    responsibleAdultDetails,
    primaryAddressDetails,
    secondaryAddressDetails,
    interestedParties,
    installationAndRisk,
    monitoringOrderTypeDescription,
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
      monitoringOrderTypeDescription,
      probationDeliveryUnit,
    })

    this.fillInCurfewOrderDetailsWith({
      curfewConditionDetails,
      curfewReleaseDetails,
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
    installationAddressDetails,
    curfewReleaseDetails,
    curfewConditionDetails,
    curfewTimetable,
    enforcementZoneDetails,
    alcoholMonitoringDetails,
    trailMonitoringDetails,
    attendanceMonitoringDetails,
    files,
    probationDeliveryUnit,
    installationLocation,
    installationAppointment,
    tertiaryAddressDetails = undefined,
    monitoringOrderTypeDescription = undefined,
  }): OrderTasksPage {
    this.aboutTheDeviceWearerTask.click()

    this.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      responsibleAdultDetails,
      primaryAddressDetails,
      secondaryAddressDetails,
      interestedParties,
      installationAndRisk,
      probationDeliveryUnit,
      tertiaryAddressDetails,
      monitoringOrderTypeDescription,
    })
    if (curfewReleaseDetails) {
      this.fillInCurfewOrderDetailsWith(
        {
          curfewConditionDetails,
          curfewReleaseDetails,
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
          installationAddressDetails,
        },
        false,
      )
    }

    if (attendanceMonitoringDetails) {
      this.fillInAttendanceMonitoringDetailsWith(
        {
          attendanceMonitoringDetails,
        },
        false,
      )
    }

    if (installationLocation) {
      fillInTagAtSourceWith(installationLocation, installationAppointment, installationAddressDetails)
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
    monitoringOrderTypeDescription,
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
      monitoringOrderTypeDescription,
      probationDeliveryUnit,
    })

    this.fillInCurfewOrderDetailsWith({
      curfewConditionDetails,
      curfewReleaseDetails,
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
    monitoringOrderTypeDescription,
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
      monitoringOrderTypeDescription,
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
    monitoringOrderTypeDescription,
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
      monitoringOrderTypeDescription,
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
    monitoringOrderTypeDescription,
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
      monitoringOrderTypeDescription,
      probationDeliveryUnit,
    })

    this.fillInAlcoholMonitoringOrderDetailsWith({
      alcoholMonitoringDetails,
      installationAddressDetails,
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
    monitoringOrderTypeDescription,
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
      monitoringOrderTypeDescription,
      probationDeliveryUnit,
    })

    this.fillInAlcoholMonitoringOrderDetailsWith({
      alcoholMonitoringDetails,
      installationAddressDetails,
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
    monitoringOrderTypeDescription,
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
      monitoringOrderTypeDescription,
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

  makeChanges(): void {
    this.makeChangesButton.click()
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
    responsibleAdultDetails = undefined,
    primaryAddressDetails = undefined,
    secondaryAddressDetails = undefined,
    interestedParties = undefined,
    installationAndRisk = undefined,
    probationDeliveryUnit = undefined,
    tertiaryAddressDetails = undefined,
    monitoringOrderTypeDescription = undefined,
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
        hasAnotherAddress: tertiaryAddressDetails === undefined ? 'No' : 'Yes',
      })
      secondaryAddressPage.form.saveAndContinueButton.click()
    }

    if (tertiaryAddressDetails !== undefined) {
      const tertiaryAddressPage = Page.verifyOnPage(TertiaryAddressPage)
      tertiaryAddressPage.form.fillInWith({
        ...tertiaryAddressDetails,
      })
      tertiaryAddressPage.form.saveAndContinueButton.click()
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

    if (installationAndRisk) {
      const installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
      installationAndRiskPage.form.fillInWith(installationAndRisk)
      installationAndRiskPage.form.saveAndContinueButton.click()

      const installationAndRiskCheckYourAnswersPage = Page.verifyOnPage(
        InstallationAndRiskCheckYourAnswersPage,
        'Check your answer',
      )
      installationAndRiskCheckYourAnswersPage.continueButton().click()
    }

    if (monitoringOrderTypeDescription) {
      fillInOrderTypeDescriptionsWith(monitoringOrderTypeDescription)
    }
  }

  fillInCurfewOrderDetailsWith(
    { curfewConditionDetails, curfewReleaseDetails, curfewTimetable },
    checkYourAnswerPage = true,
  ): void {
    fillInCurfewOrderDetailsWith({ curfewConditionDetails, curfewReleaseDetails, curfewTimetable })
    if (checkYourAnswerPage) {
      const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(
        MonitoringConditionsCheckYourAnswersPage,
        'Check your answer',
      )
      monitoringConditionsCheckYourAnswersPage.continueButton().click()
    }
  }

  fillInEnforcementZoneOrderDetailsWith({ enforcementZoneDetails }, checkYourAnswerPage = true) {
    fillInEnforcementZoneOrderDetailsWith(enforcementZoneDetails)

    if (checkYourAnswerPage) {
      const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(
        MonitoringConditionsCheckYourAnswersPage,
        'Check your answer',
      )
      monitoringConditionsCheckYourAnswersPage.continueButton().click()
    }
  }

  fillInAlcoholMonitoringOrderDetailsWith(
    { alcoholMonitoringDetails, installationAddressDetails },
    checkYourAnswerPage = true,
  ): void {
    fillInAlcoholMonitoringOrderDetailsWith(alcoholMonitoringDetails)

    if (checkYourAnswerPage) {
      const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(
        MonitoringConditionsCheckYourAnswersPage,
        'Check your answer',
      )
      monitoringConditionsCheckYourAnswersPage.continueButton().click()
    }
  }

  fillInTrailMonitoringOrderDetailsWith({ trailMonitoringDetails }, checkYourAnswerPage = true): void {
    fillInTrailMonitoringOrderDetailsWith(trailMonitoringDetails)

    if (checkYourAnswerPage) {
      const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(
        MonitoringConditionsCheckYourAnswersPage,
        'Check your answer',
      )
      monitoringConditionsCheckYourAnswersPage.continueButton().click()
    }
  }

  fillInAttachmentDetailsWith({ files }): void {
    const uploadLicencePage = Page.verifyOnPage(UploadLicencePage)
    uploadLicencePage.form.fillInWith({
      file: files.licence,
    })
    uploadLicencePage.form.saveAndContinueButton.click()

    if (files && files.photoId !== undefined) {
      const havePhotoPage = Page.verifyOnPage(HavePhotoPage)
      havePhotoPage.form.havePhotoField.set('Yes')
      havePhotoPage.form.saveAndContinueButton.click()

      const uploadPhotoIdPage = Page.verifyOnPage(UploadPhotoIdPage)
      uploadPhotoIdPage.form.fillInWith({
        file: files.photoId,
      })
      uploadPhotoIdPage.form.saveAndContinueButton.click()
    } else {
      const havePhotoPage = Page.verifyOnPage(HavePhotoPage)
      havePhotoPage.form.havePhotoField.set('No')
      havePhotoPage.form.saveAndContinueButton.click()
    }

    const attachmentPage = Page.verifyOnPage(AttachmentSummaryPage)

    attachmentPage.backToSummaryButton.click()
  }

  fillInAttendanceMonitoringDetailsWith({ attendanceMonitoringDetails }, checkYourAnswerPage = true): void {
    fillInAttendanceMonitoringDetailsWith(attendanceMonitoringDetails)

    if (checkYourAnswerPage) {
      const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(
        MonitoringConditionsCheckYourAnswersPage,
        'Check your answer',
      )
      monitoringConditionsCheckYourAnswersPage.continueButton().click()
    }
  }
}
