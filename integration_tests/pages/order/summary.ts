import AppPage from '../appPage'
import Page, { PageElement } from '../page'
import paths from '../../../server/constants/paths'
import Task from '../components/task'
import AboutDeviceWearerPage from './about-the-device-wearer/device-wearer'
import ResponsibleAdultDetailsPage from './about-the-device-wearer/responsible-adult-details'
import ContactDetailsPage from './contact-information/contact-details'
import NoFixedAbodePage from './contact-information/no-fixed-abode'
import InterestedPartiesPage from './contact-information/interested-parties'
import InstallationAndRiskCheckYourAnswersPage from './installation-and-risk/check-your-answers'
import AttachmentSummaryPage from './attachments/summary'
import DeviceWearerCheckYourAnswersPage from './about-the-device-wearer/check-your-answers'
import MonitoringConditionsCheckYourAnswersPage from './monitoring-conditions/check-your-answers'
import ContactInformationCheckYourAnswersPage from './contact-information/check-your-answers'
import IdentityNumbersPage from './about-the-device-wearer/identity-numbers'
import UploadPhotoIdPage from './attachments/uploadPhotoId'
import VariationDetailsPage from './variation/variationDetails'
import UploadLicencePage from './attachments/uploadLicence'
import ProbationDeliveryUnitPage from './contact-information/probation-delivery-unit'
import HavePhotoPage from './attachments/havePhoto'
import fillInOrderTypeDescriptionsWith from '../../utils/scenario-flows/orderTypeDescription'
import fillInTagAtSourceWith from '../../utils/scenario-flows/tag-at-source.cy'
import fillInCurfewOrderDetailsWith from '../../utils/scenario-flows/curfew.cy'
import { fillInEnforcementZoneListItemDetailsWith } from '../../utils/scenario-flows/enforcement-zone.cy'
import fillInAlcoholMonitoringOrderDetailsWith from '../../utils/scenario-flows/alcohol-monitoring.cy'
import fillInTrailMonitoringOrderDetailsWith from '../../utils/scenario-flows/trail-monitoring.cy'
import fillInAttendanceMonitoringDetailsWith from '../../utils/scenario-flows/attendance-monitoring.cy'
import Timeline from '../components/timeline'
import HaveCourtOrderPage from '../../e2e/order/attachments/have-court-order/courtOrderDocumentPage'
import UploadCourtOrderPage from '../../e2e/order/attachments/upload-court-order/uploadCourtOrderPage'
import OffencePage from '../../e2e/order/access-needs-installation-risk/offences/offence/offencePage'
import OffenceOtherInfoPage from '../../e2e/order/access-needs-installation-risk/offences/offence-other-info/offenceOtherInfoPage'
import DetailsOfInstallationPage from '../../e2e/order/access-needs-installation-risk/details-of-installation/DetailsOfInstallationPage'
import IsMappaPage from '../../e2e/order/access-needs-installation-risk/is-mappa/IsMappaPage'
import OffenceListPage from '../../e2e/order/access-needs-installation-risk/offences/offence-list/offenceListPage'
import TypesOfMonitoringNeededPage from '../../e2e/order/monitoring-conditions/order-type-description/types-of-monitoring-needed/TypesOfMonitoringNeededPage'
import DapoPage from '../../e2e/order/access-needs-installation-risk/offences/dapo/DapoPage'
import MonitoringTypePage from '../../e2e/order/monitoring-conditions/order-type-description/monitoring-type/MonitoringTypesPage'
import fillInAboutTheDeviceWearer from '../../utils/scenario-flows/about-the-device-wearer-flow.cy'
import ResponsibleOrganisationPage from '../../e2e/order/interested-parties/responsible-organisation/responsibleOrganisationPage'
import NationalSecurityDirectoratePage from '../../e2e/order/interested-parties/national-security-directorate/nationalSecurityDirectoratePage'
import ResponsibleOfficerPage from '../../e2e/order/interested-parties/responsible-officer/responsibleOfficerPage'
import fillinAddress from '../../utils/scenario-flows/postcode-lookup.cy'

export default class OrderTasksPage extends AppPage {
  constructor(isOldVersionPage: boolean = false) {
    let path: string = paths.ORDER.SUMMARY
    if (isOldVersionPage) {
      path = paths.ORDER.SUMMARY_VERSION
    }
    super('Electronic Monitoring application form', path, '')
  }

  get variationDetailsTask(): Task {
    return new Task('About the changes in this version of the form')
  }

  get interestedPartiesTask(): Task {
    return new Task('About the Responsible Organisation')
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

  get timeline(): Timeline {
    return new Timeline()
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
    secondEnforcementZoneDetails = undefined,
    alcoholMonitoringDetails,
    trailMonitoringDetails,
    attendanceMonitoringDetails,
    files,
    probationDeliveryUnit,
    installationLocation,
    installationAppointment,
    tertiaryAddressDetails = undefined,
    monitoringOrderTypeDescription = undefined,
    newDeviceWearerFlow = false,
  }): OrderTasksPage {
    if (newDeviceWearerFlow && interestedParties.notifyingOrganisation !== 'Home Office') {
      this.interestedPartiesTask.click()

      if (interestedParties.responsibleOfficer) {
        const responsibleOfficerPage = Page.verifyOnPage(ResponsibleOfficerPage)
        responsibleOfficerPage.form.fillInWith({
          firstName: interestedParties.responsibleOfficer.firstName,
          lastName: interestedParties.responsibleOfficer.lastName,
          email: interestedParties.responsibleOfficer.email,
        })
        responsibleOfficerPage.form.continueButton.click()
      }

      const responsibleOrgPage = Page.verifyOnPage(ResponsibleOrganisationPage)
      responsibleOrgPage.form.fillInWith(interestedParties)
      responsibleOrgPage.form.continueButton.click()

      if (interestedParties.responsibleOrganisation.toUpperCase() === 'PROBATION') {
        const nationalSecurityDirectoratePage = Page.verifyOnPage(NationalSecurityDirectoratePage)
        nationalSecurityDirectoratePage.form.fillInWith('No')
        nationalSecurityDirectoratePage.form.continueButton.click()
      }

      if (
        interestedParties.responsibleOrganisation.toUpperCase() === 'PROBATION' &&
        probationDeliveryUnit !== undefined
      ) {
        const probationDeliveryUnitPage = Page.verifyOnPage(
          ProbationDeliveryUnitPage,
          'About the Responsible Organisation',
        )
        probationDeliveryUnitPage.form.fillInWith(probationDeliveryUnit)
        probationDeliveryUnitPage.form.saveAndContinueButton.click()
      }

      const contactInformationCheckYourAnswersPage = Page.verifyOnPage(
        ContactInformationCheckYourAnswersPage,
        'Check your answer',
        '',
        false,
        'About the Responsible Organisation',
      )
      contactInformationCheckYourAnswersPage.saveAndReturnButton.click()
    } else {
      this.aboutTheDeviceWearerTask.click()
    }

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
      newDeviceWearerFlow,
    })

    if (Array.isArray(monitoringOrderTypeDescription.monitoringCondition)) {
      monitoringOrderTypeDescription.monitoringCondition.forEach((condition: string, index: number) => {
        let monitoringConditionPage = Page.verifyOnPage(MonitoringTypePage)
        monitoringConditionPage.form.fillInWith(condition)
        monitoringConditionPage.form.continueButton.click()

        if (condition === 'Curfew') {
          this.fillInCurfewOrderDetailsWith(
            {
              curfewConditionDetails,
              curfewReleaseDetails,
              curfewTimetable,
            },
            false,
          )
        }

        if (condition === 'Exclusion zone monitoring') {
          this.fillInEnforcementZoneOrderDetailsWith(
            {
              enforcementZoneDetails,
            },
            false,
          )
          if (secondEnforcementZoneDetails) {
            const monitoringConditionsListPage = Page.verifyOnPage(TypesOfMonitoringNeededPage)
            monitoringConditionsListPage.form.fillInWith('Yes')
            monitoringConditionsListPage.form.saveAndContinueButton.click()

            monitoringConditionPage = Page.verifyOnPage(MonitoringTypePage)
            monitoringConditionPage.form.fillInWith(condition)
            monitoringConditionPage.form.continueButton.click()

            this.fillInEnforcementZoneOrderDetailsWith(
              {
                enforcementZoneDetails: secondEnforcementZoneDetails,
              },
              false,
            )
          }
        }

        if (condition === 'Trail monitoring') {
          this.fillInTrailMonitoringOrderDetailsWith(
            {
              trailMonitoringDetails,
            },
            false,
          )
        }

        if (condition === 'Alcohol monitoring') {
          this.fillInAlcoholMonitoringOrderDetailsWith(
            {
              alcoholMonitoringDetails,
              installationAddressDetails,
            },
            false,
          )
        }

        if (condition === 'Mandatory attendance monitoring') {
          this.fillInAttendanceMonitoringDetailsWith(
            {
              attendanceMonitoringDetails,
            },
            false,
          )
        }

        if (index === monitoringOrderTypeDescription.monitoringCondition.length - 1) {
          const monitoringConditionsListPage = Page.verifyOnPage(TypesOfMonitoringNeededPage)
          monitoringConditionsListPage.form.fillInWith('No')
          monitoringConditionsListPage.form.saveAndContinueButton.click()
        } else {
          const monitoringConditionsListPage = Page.verifyOnPage(TypesOfMonitoringNeededPage)
          monitoringConditionsListPage.form.fillInWith('Yes')
          monitoringConditionsListPage.form.saveAndContinueButton.click()
        }
      })
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
    newDeviceWearerFlow = false,
  }): void {
    if (!newDeviceWearerFlow) {
      const identityNumbersPage = Page.verifyOnPage(IdentityNumbersPage)
      identityNumbersPage.form.fillInWith(deviceWearerDetails)
      identityNumbersPage.form.saveAndContinueButton.click()

      const aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
      aboutDeviceWearerPage.form.fillInWith(deviceWearerDetails)
      aboutDeviceWearerPage.form.saveAndContinueButton.click()

      if (responsibleAdultDetails) {
        const responsibleAdultDetailsPage = Page.verifyOnPage(ResponsibleAdultDetailsPage)
        responsibleAdultDetailsPage.form.fillInWith(responsibleAdultDetails)
        responsibleAdultDetailsPage.form.saveAndContinueButton.click()
      }

      const deviceWearerCheckYourAnswersPage = Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')
      deviceWearerCheckYourAnswersPage.continueButton().click()

      const contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
      contactDetailsPage.form.fillInWith(deviceWearerDetails)
      contactDetailsPage.form.saveAndContinueButton.click()

      const noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
      noFixedAbode.form.fillInWith(deviceWearerDetails)
      noFixedAbode.form.saveAndContinueButton.click()

      if (primaryAddressDetails) {
        fillinAddress({
          findAddress: {},
          addressResult: {},
          enterAddress: primaryAddressDetails,
          addAnother: secondaryAddressDetails === undefined ? 'No' : 'Yes',
        })

        if (secondaryAddressDetails !== undefined) {
          fillinAddress({
            findAddress: {},
            addressResult: {},
            enterAddress: secondaryAddressDetails,
            addAnother: tertiaryAddressDetails === undefined ? 'No' : 'Yes',
            addressType: 'SECONDARY',
          })
        }

        if (tertiaryAddressDetails !== undefined) {
          fillinAddress({
            findAddress: {},
            addressResult: {},
            enterAddress: tertiaryAddressDetails,
            addressType: 'TERTIARY',
          })
        }
      }
      if (interestedParties) {
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
      }
    } else {
      fillInAboutTheDeviceWearer({
        deviceWearerDetails,
        responsibleAdultDetails,
        primaryAddressDetails,
        secondaryAddressDetails,
        tertiaryAddressDetails,
      })
      const deviceWearerCheckYourAnswersPage = Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')
      deviceWearerCheckYourAnswersPage.continue()
    }

    if (installationAndRisk) {
      if (interestedParties.notifyingOrganisation !== 'Home Office') {
        if (interestedParties.notifyingOrganisation === 'Family Court') {
          const dapoPage = Page.verifyOnPage(DapoPage)
          dapoPage.form.fillInWith({ dapoClauseNumber: 'dapo clause', dapoDate: new Date(2025, 0, 1) })
          dapoPage.form.saveAndContinueButton.click()

          const offenceListPage = Page.verifyOnPage(OffenceListPage, undefined, undefined, 'DAPO order clauses')
          offenceListPage.form.fillInWith({ addDapoClause: 'No' })
          offenceListPage.form.saveAndContinueButton.click()
        } else if (interestedParties.notifyingOrganisation === 'Civil and County Court') {
          const offencePage = Page.verifyOnPage(OffencePage)
          offencePage.form.fillInWith({ offenceType: installationAndRisk.offence, offenceDate: new Date(2025, 0, 1) })
          offencePage.form.saveAndContinueButton.click()

          const offenceListPage = Page.verifyOnPage(OffenceListPage)
          offenceListPage.form.fillInWith({ addOffence: 'No' })
          offenceListPage.form.saveAndContinueButton.click()

          const offenceDetailsPage = Page.verifyOnPage(OffenceOtherInfoPage)
          offenceDetailsPage.form.fillInWith({ hasOtherInformation: 'No' })
          offenceDetailsPage.form.saveAndContinueButton.click()
        } else {
          const offencePage = Page.verifyOnPage(OffencePage)
          offencePage.form.fillInWith({ offenceType: installationAndRisk.offence })
          offencePage.form.saveAndContinueButton.click()

          const offenceDetailsPage = Page.verifyOnPage(OffenceOtherInfoPage)
          offenceDetailsPage.form.fillInWith({ hasOtherInformation: 'No' })
          offenceDetailsPage.form.saveAndContinueButton.click()
        }
      }

      const detailsOfInstallationPage = Page.verifyOnPage(DetailsOfInstallationPage)
      detailsOfInstallationPage.form.fillInWith({
        possibleRisks: [installationAndRisk.possibleRisk],
        riskCategories: [installationAndRisk.riskCategory],
        riskDetails: installationAndRisk.riskDetails,
      })
      detailsOfInstallationPage.form.saveAndContinueButton.click()

      if (interestedParties.notifyingOrganisation === 'Home Office') {
        const mappaPage = Page.verifyOnPage(IsMappaPage)
        mappaPage.form.fillInWith({ isMappa: 'No' })
        mappaPage.form.saveAndContinueButton.click()
      }

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
    fillInEnforcementZoneListItemDetailsWith(enforcementZoneDetails)

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
    if (files.licence !== undefined) {
      const uploadLicencePage = Page.verifyOnPage(UploadLicencePage)
      uploadLicencePage.form.fillInWith({
        file: files.licence,
      })
      uploadLicencePage.form.saveAndContinueButton.click()
    }

    if (files.courtOrder !== undefined) {
      const haveCourtOrderPage = Page.verifyOnPage(HaveCourtOrderPage)
      haveCourtOrderPage.form.fillInWith(files.courtOrder.fileRequired)
      haveCourtOrderPage.form.saveAndContinueButton.click()

      if (files.courtOrder.fileRequired === 'Yes') {
        const uploadCourtOrderPage = Page.verifyOnPage(UploadCourtOrderPage)
        uploadCourtOrderPage.form.fillInWith({
          file: files.courtOrder,
        })
        uploadCourtOrderPage.form.saveAndContinueButton.click()
      }
    }

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
